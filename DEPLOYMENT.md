# Built On Purpose — Deployment Guide

Your app is fully built. This guide gets it live in ~15-20 minutes.

## What you need before starting
- A free [Supabase](https://supabase.com) account
- A free [Vercel](https://vercel.com) account
- A [Google Cloud Console](https://console.cloud.google.com) account (for Google sign-in)
- A GitHub account (Vercel deploys from a Git repo)

---

## Step 1 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Pick a name (e.g. `built-on-purpose`), a database password (save it somewhere safe), and a region close to your audience (e.g. closest to South Africa if your subscribers are mostly there).
3. Wait ~2 minutes for the project to provision.
4. Once it's ready, go to **SQL Editor** in the left sidebar → **New query**.
5. Open `supabase/migrations/0001_init.sql` from this project, copy the whole file, paste it into the SQL editor, and click **Run**.
   - This creates all four tables (`profiles`, `weekly_updates`, `masterclasses`, `articles`), the auto-profile trigger, and all the row-level security policies.
6. Go to **Settings → API**. You'll need two values from this page in Step 3:
   - **Project URL**
   - **anon public** key

## Step 2 — Set up Google sign-in

1. Go to [Google Cloud Console](https://console.cloud.google.com) → create a new project (or use an existing one).
2. Go to **APIs & Services → OAuth consent screen**. Choose **External**, fill in the app name (Built On Purpose), your email, and save.
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**
   - Name: anything, e.g. "Built On Purpose"
   - **Authorized redirect URIs**: add this exact URL, replacing `your-project-ref` with your actual Supabase project ref (found in your Supabase project URL):
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
4. Click **Create**. Copy the **Client ID** and **Client Secret**.
5. Back in Supabase: **Authentication → Providers → Google**. Toggle it on, paste in your Client ID and Client Secret, and save.
6. In Supabase **Authentication → URL Configuration**, set:
   - **Site URL**: your future production URL (you'll update this after Step 4 if you don't know it yet — `https://your-app-name.vercel.app` or your custom domain)
   - **Redirect URLs**: add `https://your-app-name.vercel.app/auth/callback` (and `http://localhost:3000/auth/callback` for local testing)

## Step 3 — Push the code to GitHub

1. Create a new, empty repository on GitHub (e.g. `built-on-purpose`).
2. From the project folder on your computer:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/built-on-purpose.git
   git push -u origin main
   ```

## Step 4 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import your GitHub repo.
2. Before deploying, expand **Environment Variables** and add:
   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL from Step 1 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key from Step 1 |
3. Click **Deploy**. Wait ~2 minutes.
4. Once live, copy your Vercel URL (e.g. `https://built-on-purpose.vercel.app`).
5. Go back to Supabase **Authentication → URL Configuration** and make sure the **Site URL** and **Redirect URLs** match your real Vercel URL (update if you used a placeholder earlier).

## Step 5 — Make yourself an admin

By default, every new signup is a `member`. To make your own account an admin:

1. Sign up for an account on your live site normally (via the `/signup` page).
2. In Supabase, go to **Table Editor → profiles**.
3. Find your row (by email), click into the `role` column, change it from `member` to `admin`, and save.
4. Refresh your dashboard — you'll now see an **Admin →** link in the nav.

## Step 6 — Add your first content

Sign in, go to `/admin`, and create your first field note, masterclass, or article. Toggle **Published** on when you're ready for members to see it.

---

## Custom domain (optional)

In Vercel: **Project → Settings → Domains** → add your domain and follow the DNS instructions. Once added, update the **Site URL** and **Redirect URLs** in Supabase to match your custom domain instead of the `.vercel.app` one.

## Local development

```bash
npm install
cp .env.local.example .env.local
# fill in your Supabase URL + anon key in .env.local
npm run dev
```

## A note on email confirmation

By default, Supabase requires email confirmation before someone can sign in with email/password. If you'd rather subscribers get instant access, go to **Authentication → Providers → Email** in Supabase and toggle off "Confirm email." Google sign-in is unaffected either way.


---

## Image uploads (Supabase Storage)

**Run the storage migration:**

After running `0001_init.sql`, go back to the Supabase SQL Editor and run `supabase/migrations/0002_storage.sql`. This creates the `images` bucket with a 5 MB file size limit and the correct RLS policies (admins can upload; everyone can view).

That's it. Image uploads in the admin forms will work automatically once the bucket exists.

**File limits:**
- Formats: JPEG, PNG, WebP, GIF
- Max size: 5 MB per file

---

## Email (Resend)

**1. Create a Resend account**

Go to [resend.com](https://resend.com) and sign up for a free account. The free tier allows 3,000 emails/month and 100/day — more than enough to start.

**2. Add and verify your domain**

In the Resend dashboard → **Domains** → **Add domain**. Add your domain (e.g. `builtonpurpose.com`) and follow the DNS instructions. This takes a few minutes to propagate.

Until your domain is verified, you can test by using `onboarding@resend.dev` as the FROM address — but emails will only deliver to your own account's email, not to real subscribers.

**3. Create an API key**

Resend dashboard → **API Keys** → **Create API Key**. Give it a name and copy the key (it's shown once).

**4. Run the email log migration**

In Supabase SQL Editor, run `supabase/migrations/0003_email_sends.sql`. This creates the `email_sends` table that prevents duplicate sends when you edit an already-published field note.

**5. Add environment variables to Vercel**

In your Vercel project → **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | `re_your_key_here` |
| `FROM_EMAIL` | `Built On Purpose <notes@yourdomain.com>` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app-name.vercel.app` (or your custom domain) |

**6. Redeploy**

Vercel auto-deploys when you push to GitHub. Trigger a manual redeploy from the Vercel dashboard after adding the env vars, or push any small change.

**How it works:**
- When you toggle a field note to **Published** and save, the API checks if an email has already been sent for that note.
- If not, it sends to every subscriber with `subscribed = true`, in batches of 50.
- The send is logged to `email_sends` — subsequent saves/edits to the same published note never re-send.
- The admin field notes list shows a **✓ Email sent** badge next to each published note that has been sent.

**Testing locally:**
- Leave `RESEND_API_KEY` unset in your `.env.local` — the app will log a warning and skip sending silently. No errors thrown.
- To test a real send locally, add your Resend API key to `.env.local` and set `FROM_EMAIL=onboarding@resend.dev` (Resend's test address, delivers only to your own inbox).
