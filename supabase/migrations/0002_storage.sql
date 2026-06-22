-- ============================================================
-- Built On Purpose — Storage: images bucket
-- Run this in Supabase SQL Editor after 0001_init.sql
-- ============================================================

-- Create the images bucket (public read, so image URLs work without auth tokens)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'images',
  'images',
  true,
  5242880, -- 5 MB per file
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Admins can upload, update, and delete images
create policy "Admins can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'images'
    and public.is_admin()
  );

create policy "Admins can update images"
  on storage.objects for update
  using (
    bucket_id = 'images'
    and public.is_admin()
  );

create policy "Admins can delete images"
  on storage.objects for delete
  using (
    bucket_id = 'images'
    and public.is_admin()
  );

-- Anyone (including unauthenticated visitors) can read images
-- This is what makes public image URLs work without an auth token
create policy "Public can view images"
  on storage.objects for select
  using (bucket_id = 'images');
