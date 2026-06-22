import { createClient } from '@/lib/supabase/server';
import type { WeeklyUpdate, Masterclass, Article, Profile } from '@/types/database';

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data as Profile | null;
}

export async function getWeeklyUpdates(limit?: number): Promise<WeeklyUpdate[]> {
  const supabase = await createClient();
  let query = supabase
    .from('weekly_updates')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data as WeeklyUpdate[]) ?? [];
}

export async function getWeeklyUpdate(id: string): Promise<WeeklyUpdate | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('weekly_updates')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();
  return data as WeeklyUpdate | null;
}

export async function getMasterclasses(): Promise<Masterclass[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('masterclasses')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  return (data as Masterclass[]) ?? [];
}

export async function getMasterclass(id: string): Promise<Masterclass | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('masterclasses')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();
  return data as Masterclass | null;
}

export async function getArticles(limit?: number): Promise<Article[]> {
  const supabase = await createClient();
  let query = supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data as Article[]) ?? [];
}

export async function getArticle(id: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();
  return data as Article | null;
}
