import { SITE_URL } from "./client";

interface FieldNoteEmailProps {
  title: string;
  body: string;         // markdown body — we send a truncated plain excerpt in email
  theme: string | null;
  updateId: string;
  recipientName: string | null;
}

/**
 * Returns a plain-text excerpt (first ~300 chars) suitable for email preview
 * without rendering full markdown.
 */
function toExcerpt(markdown: string, maxLen = 300): string {
  // Strip markdown syntax for a readable excerpt
  const plain = markdown
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

export function fieldNoteEmailHtml({
  title,
  body,
  theme,
  updateId,
  recipientName,
}: FieldNoteEmailProps): string {
  const excerpt = toExcerpt(body);
  const readUrl = `${SITE_URL}/dashboard/updates/${updateId}`;
  const greeting = recipientName ? `Hi ${recipientName.split(" ")[0]},` : "Hi,";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#FAF6EE;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF6EE;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #D4C5B0;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8B6F4E;">
                Built On Purpose
              </p>
            </td>
          </tr>

          <!-- Theme stamp (if present) -->
          ${theme ? `
          <tr>
            <td style="padding-top:28px;padding-bottom:8px;">
              <span style="display:inline-block;border:1.5px solid #C44536;border-radius:9999px;padding:3px 12px;font-family:Courier New,monospace;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#C44536;transform:rotate(-2deg);">
                ${theme}
              </span>
            </td>
          </tr>` : `<tr><td style="padding-top:28px;"></td></tr>`}

          <!-- Title -->
          <tr>
            <td style="padding-bottom:20px;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:600;color:#1C1A17;line-height:1.25;">
                ${title}
              </h1>
            </td>
          </tr>

          <!-- Greeting + excerpt -->
          <tr>
            <td style="padding-bottom:28px;border-bottom:1px solid #E8DDD0;">
              <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;color:#564E42;line-height:1.7;">
                ${greeting}
              </p>
              <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:#1C1A17;line-height:1.75;">
                ${excerpt}
              </p>
              <a href="${readUrl}"
                 style="display:inline-block;background-color:#1C1A17;color:#FAF6EE;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:13px 22px;border-radius:2px;">
                Read the full note →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#8B6F4E;line-height:1.6;">
                You're receiving this because you're a member of Built On Purpose.
                <br />
                <a href="${SITE_URL}/dashboard" style="color:#8B6F4E;">Visit your dashboard</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function fieldNoteEmailText({
  title,
  body,
  updateId,
  recipientName,
}: Omit<FieldNoteEmailProps, "theme">): string {
  const excerpt = toExcerpt(body);
  const readUrl = `${SITE_URL}/dashboard/updates/${updateId}`;
  const greeting = recipientName ? `Hi ${recipientName.split(" ")[0]},` : "Hi,";

  return `BUILT ON PURPOSE

${title}

${greeting}

${excerpt}

Read the full note: ${readUrl}

---
You're receiving this because you're a member of Built On Purpose.
Visit your dashboard: ${SITE_URL}/dashboard`;
}
