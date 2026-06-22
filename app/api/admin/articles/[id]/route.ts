import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data/require-admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const body = await request.json();
  const { title, excerpt, body: content, theme, cover_image_url, published } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
  }

  const { data: existing } = await auth.supabase
    .from("articles")
    .select("published, published_at")
    .eq("id", id)
    .single();

  const justPublished = published && !existing?.published;

  const { data, error } = await auth.supabase
    .from("articles")
    .update({
      title,
      excerpt: excerpt || null,
      body: content,
      theme: theme || null,
      cover_image_url: cover_image_url || null,
      published: !!published,
      published_at: published
        ? justPublished
          ? new Date().toISOString()
          : existing?.published_at
        : null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const { error } = await auth.supabase.from("articles").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
