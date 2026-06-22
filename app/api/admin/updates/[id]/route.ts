import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/data/require-admin";
import { sendFieldNoteEmail } from "@/lib/email/send";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const body = await request.json();
  const { title, body: content, theme, published } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
  }

  // Fetch current state to decide published_at and whether to send email
  const { data: existing } = await auth.supabase
    .from("weekly_updates")
    .select("published, published_at")
    .eq("id", id)
    .single();

  const justPublished = published && !existing?.published;

  const { data, error } = await auth.supabase
    .from("weekly_updates")
    .update({
      title,
      body: content,
      theme: theme || null,
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

  // Only send the email on the first publish — sendFieldNoteEmail
  // internally checks email_sends and skips if already sent.
  if (justPublished && data) {
    sendFieldNoteEmail(data).catch((err) =>
      console.error("Email send failed:", err)
    );
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const { error } = await auth.supabase.from("weekly_updates").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
