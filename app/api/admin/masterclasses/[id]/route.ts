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
  const {
    title,
    description,
    theme,
    format,
    video_url,
    live_at,
    live_link,
    thumbnail_url,
    published,
  } = body;

  if (!title || !format) {
    return NextResponse.json({ error: "Title and format are required." }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("masterclasses")
    .update({
      title,
      description: description || null,
      theme: theme || null,
      format,
      video_url: format === "video" ? video_url : null,
      live_at: format === "live" ? live_at : null,
      live_link: format === "live" ? live_link || null : null,
      thumbnail_url: thumbnail_url || null,
      published: !!published,
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
  const { error } = await auth.supabase.from("masterclasses").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
