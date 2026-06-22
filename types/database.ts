export type Role = 'member' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  subscribed: boolean;
  created_at: string;
}

export interface WeeklyUpdate {
  id: string;
  title: string;
  body: string;
  theme: string | null;
  published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
}

export type MasterclassFormat = 'video' | 'live';

export interface Masterclass {
  id: string;
  title: string;
  description: string | null;
  theme: string | null;
  format: MasterclassFormat;
  video_url: string | null;
  live_at: string | null;
  live_link: string | null;
  thumbnail_url: string | null;
  published: boolean;
  author_id: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  theme: string | null;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
}

export const THEMES = [
  'Personal Responsibility',
  'Purpose-Driven Living',
  'Character Before Achievement',
  'Growth Through Adversity',
  'Legacy and Generational Impact',
  'Faith-Based Wisdom Applied Practically',
] as const;

export const THEME_FRAMEWORKS: Record<string, string> = {
  'Personal Responsibility': 'M.I.N.E.',
  'Purpose-Driven Living': 'D.R.I.V.E.',
  'Character Before Achievement': 'H.O.M.E.',
  'Growth Through Adversity': 'F.O.R.G.E.',
  'Legacy and Generational Impact': 'S.E.E.D.',
  'Faith-Based Wisdom Applied Practically': 'S.T.E.W.',
};
