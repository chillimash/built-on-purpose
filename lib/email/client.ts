import { Resend } from "resend";

// Lazy singleton — only instantiated when sendFieldNoteEmail() is actually called.
// This prevents Resend from throwing at module-evaluation time when RESEND_API_KEY
// isn't set (e.g. during a build without env vars, or in development).
let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error(
        "RESEND_API_KEY is not set. Add it to your environment variables."
      );
    }
    _resend = new Resend(key);
  }
  return _resend;
}

// The "from" address must be a domain you've verified in Resend.
// During development: onboarding@resend.dev (sends only to your own email)
// In production: set FROM_EMAIL in your env to e.g. notes@builtonpurpose.com
export const FROM_EMAIL =
  process.env.FROM_EMAIL ?? "Built On Purpose <onboarding@resend.dev>";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://builtonpurpose.com";
