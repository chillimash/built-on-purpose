import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data/require-admin";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json();
  const { title, excerpt, body: content, theme, cover_image_url, published } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("articles")
    .insert({
      title,
      excerpt: excerpt || null,
      body: content,
      theme: theme || null,
      cover_image_url: cover_image_url || null,
      published: !!published,
      published_at: published ? new Date().toISOString() : null,
      author_id: auth.userId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
