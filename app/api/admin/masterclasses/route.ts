import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data/require-admin";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

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
  if (format === "video" && !video_url) {
    return NextResponse.json({ error: "Video URL is required for video format." }, { status: 400 });
  }
  if (format === "live" && !live_at) {
    return NextResponse.json({ error: "Date/time is required for live format." }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("masterclasses")
    .insert({
      title,
      description: description || null,
      theme: theme || null,
      format,
      video_url: format === "video" ? video_url : null,
      live_at: format === "live" ? live_at : null,
      live_link: format === "live" ? live_link || null : null,
      thumbnail_url: thumbnail_url || null,
      published: !!published,
      author_id: auth.userId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
