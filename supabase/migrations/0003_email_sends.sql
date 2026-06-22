-- ============================================================
-- Built On Purpose — Email send log
-- Tracks which field notes have had their publish email sent,
-- so edits to already-published notes don't re-trigger sends.
-- ============================================================

create table if not exists public.email_sends (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('weekly_update')),
  content_id uuid not null,
  sent_at timestamptz not null default now(),
  recipient_count int not null default 0,
  unique (content_type, content_id)  -- one send per piece of content, ever
);

alter table public.email_sends enable row level security;

-- Only admins can see the email send log
create policy "Admins can view email sends"
  on public.email_sends for select
  using (public.is_admin());

create policy "Admins can insert email sends"
  on public.email_sends for insert
  with check (public.is_admin());
