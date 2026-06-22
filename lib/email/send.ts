import { createClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "./client";
import { fieldNoteEmailHtml, fieldNoteEmailText } from "./templates";
import type { WeeklyUpdate, Profile } from "@/types/database";

/**
 * Sends a publish notification email to all subscribed members.
 *
 * Guards:
 * 1. Only sends if the update is actually published.
 * 2. Checks email_sends — if a row already exists for this content_id,
 *    it was already sent and we skip silently (safe to call on every save).
 * 3. Batches sends in groups of 50 with a small delay to respect Resend
 *    rate limits on free/starter plans (100 req/s, 50 burst).
 *
 * Returns { sent: number, skipped: boolean, error?: string }
 */
export async function sendFieldNoteEmail(
  update: WeeklyUpdate
): Promise<{ sent: number; skipped: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email send.");
    return { sent: 0, skipped: true };
  }

  if (!update.published) {
    return { sent: 0, skipped: true };
  }

  const supabase = await createClient();

  // Guard: already sent?
  const { data: existing } = await supabase
    .from("email_sends")
    .select("id")
    .eq("content_type", "weekly_update")
    .eq("content_id", update.id)
    .maybeSingle();

  if (existing) {
    return { sent: 0, skipped: true };
  }

  // Fetch all subscribed members
  const { data: subscribers, error: subError } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("subscribed", true);

  if (subError) {
    return { sent: 0, skipped: false, error: subError.message };
  }

  if (!subscribers || subscribers.length === 0) {
    return { sent: 0, skipped: false };
  }

  // Send in batches of 50
  const BATCH_SIZE = 50;
  let sent = 0;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE) as Pick<
      Profile,
      "email" | "full_name"
    >[];

    await Promise.allSettled(
      batch.map((sub) =>
        getResend().emails.send({
          from: FROM_EMAIL,
          to: sub.email,
          subject: `Field Note: ${update.title}`,
          html: fieldNoteEmailHtml({
            title: update.title,
            body: update.body,
            theme: update.theme,
            updateId: update.id,
            recipientName: sub.full_name,
          }),
          text: fieldNoteEmailText({
            title: update.title,
            body: update.body,
            updateId: update.id,
            recipientName: sub.full_name,
          }),
        })
      )
    );

    sent += batch.length;

    // Small delay between batches to respect rate limits
    if (i + BATCH_SIZE < subscribers.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  // Log the send so we never double-send
  await supabase.from("email_sends").insert({
    content_type: "weekly_update",
    content_id: update.id,
    recipient_count: sent,
  });

  return { sent, skipped: false };
}
