import { createClient } from '@/lib/supabase/server';
import type { WeeklyUpdate, Masterclass, Article, Profile } from '@/types/database';

// These rely on RLS: only rows visible to an admin (published=true OR is_admin())
// will ever be returned. A non-admin calling these gets only published rows.

export async function getAllWeeklyUpdates(): Promise<WeeklyUpdate[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('weekly_updates')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as WeeklyUpdate[]) ?? [];
}

export async function getWeeklyUpdateById(id: string): Promise<WeeklyUpdate | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('weekly_updates')
    .select('*')
    .eq('id', id)
    .single();
  return data as WeeklyUpdate | null;
}

export async function getAllMasterclasses(): Promise<Masterclass[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('masterclasses')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as Masterclass[]) ?? [];
}

export async function getMasterclassById(id: string): Promise<Masterclass | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('masterclasses')
    .select('*')
    .eq('id', id)
    .single();
  return data as Masterclass | null;
}

export async function getAllArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as Article[]) ?? [];
}

export async function getArticleById(id: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
  return data as Article | null;
}

export async function getAllSubscribers(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as Profile[]) ?? [];
}
