import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data/require-admin";
import { sendFieldNoteEmail } from "@/lib/email/send";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json();
  const { title, body: content, theme, published } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("weekly_updates")
    .insert({
      title,
      body: content,
      theme: theme || null,
      published: !!published,
      published_at: published ? new Date().toISOString() : null,
      author_id: auth.userId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send publish email if this was created directly as published
  if (data.published) {
    // Fire-and-forget — don't block the API response on email delivery
    sendFieldNoteEmail(data).catch((err) =>
      console.error("Email send failed:", err)
    );
  }

  return NextResponse.json({ data });
}
