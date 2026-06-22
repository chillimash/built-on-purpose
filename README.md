# Built On Purpose

A membership platform for weekly field notes, masterclasses, and articles — built around six frameworks for responsibility, purpose, and character: **M.I.N.E.**, **D.R.I.V.E.**, **H.O.M.E.**, **F.O.R.G.E.**, **S.E.E.D.**, and **S.T.E.W.**

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Supabase** — Postgres database, auth (Google OAuth + email/password), Row Level Security
- **Tailwind CSS** — custom design system (see `app/globals.css`)

## Structure

```
app/
  page.tsx                  Landing page
  login/, signup/           Auth pages
  auth/callback, auth/signout   Auth route handlers
  dashboard/                 Member-facing: field notes, masterclasses, articles
  admin/                      Admin-only: create/edit/publish all content, subscriber list
  api/admin/                  API routes used by admin forms
lib/
  supabase/                  Browser, server, and middleware Supabase clients
  data/                       Server-side data fetching (public + admin variants)
components/
  ui/                         Shared primitives (Button, Input, Select, Toggle, Stamp...)
  dashboard/, admin/, marketing/, auth/   Feature-specific components
supabase/migrations/         Database schema + RLS policies
```

## Getting started locally

```bash
npm install
cp .env.local.example .env.local
# Add your Supabase project URL + anon key to .env.local
npm run dev
```

See **DEPLOYMENT.md** for the full step-by-step guide to setting up Supabase, Google OAuth, and deploying to Vercel.

## How access control works

- Database-level: Row Level Security policies (in `supabase/migrations/0001_init.sql`) ensure non-admins can only ever read `published = true` rows, regardless of what the app code does.
- Route-level: `proxy.ts` redirects signed-out users away from `/dashboard` and `/admin`, and redirects non-admins away from `/admin`.
- API-level: every `/api/admin/*` route re-checks admin status explicitly before writing.

This is intentionally layered — even if one layer had a bug, the others still hold.
