-- ============================================================
-- Built On Purpose — Initial Schema
-- ============================================================

-- ---------- PROFILES ----------
-- Extends Supabase's built-in auth.users with app-specific fields.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  subscribed boolean not null default true,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- WEEKLY UPDATES ----------
create table if not exists public.weekly_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,           -- markdown content
  theme text,                   -- e.g. 'M.I.N.E.', 'D.R.I.V.E.' etc (optional tag)
  published boolean not null default false,
  published_at timestamptz,
  author_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------- MASTERCLASSES ----------
create table if not exists public.masterclasses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  theme text,
  format text not null check (format in ('video', 'live')),
  video_url text,               -- YouTube/Vimeo embed URL (for format = 'video')
  live_at timestamptz,          -- scheduled date/time (for format = 'live')
  live_link text,               -- Zoom/Meet link (for format = 'live')
  thumbnail_url text,
  published boolean not null default false,
  author_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------- ARTICLES ----------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  body text not null,           -- markdown content
  theme text,
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  author_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.weekly_updates enable row level security;
alter table public.masterclasses enable row level security;
alter table public.articles enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- PROFILES policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- WEEKLY UPDATES policies
create policy "Members can view published updates"
  on public.weekly_updates for select
  using (published = true or public.is_admin());

create policy "Admins can insert updates"
  on public.weekly_updates for insert
  with check (public.is_admin());

create policy "Admins can modify updates"
  on public.weekly_updates for update
  using (public.is_admin());

create policy "Admins can delete updates"
  on public.weekly_updates for delete
  using (public.is_admin());

-- MASTERCLASSES policies
create policy "Members can view published masterclasses"
  on public.masterclasses for select
  using (published = true or public.is_admin());

create policy "Admins can insert masterclasses"
  on public.masterclasses for insert
  with check (public.is_admin());

create policy "Admins can modify masterclasses"
  on public.masterclasses for update
  using (public.is_admin());

create policy "Admins can delete masterclasses"
  on public.masterclasses for delete
  using (public.is_admin());

-- ARTICLES policies
create policy "Members can view published articles"
  on public.articles for select
  using (published = true or public.is_admin());

create policy "Admins can insert articles"
  on public.articles for insert
  with check (public.is_admin());

create policy "Admins can modify articles"
  on public.articles for update
  using (public.is_admin());

create policy "Admins can delete articles"
  on public.articles for delete
  using (public.is_admin());
