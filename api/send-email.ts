import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

// REMINDER (before deploying):
// 1. Set RESEND_API_KEY in Vercel's project environment variables. Do not put the
//    real key in this file or in any .env file that gets committed.
// 2. Replace COMPANY_EMAIL below with the real address you want submissions sent to.
// 3. Once you're ready for production, verify a sending domain in the Resend
//    dashboard, then update FROM_EMAIL to use it instead of the default
//    onboarding@resend.dev address, which is fine for testing but looks less
//    trustworthy to recipients and has lower deliverability limits.
const COMPANY_EMAIL = "REPLACE_WITH_COMPANY_EMAIL@example.com";
const FROM_EMAIL = "onboarding@resend.dev";

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  honeypot?: unknown;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const body = req.body as ContactBody;

  // Bots tend to fill in every field they find, including ones a real visitor
  // never sees. If this one has anything in it, pretend the send worked and
  // stop, no error, no email, so the bot has no signal to adapt to.
  if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
    res.status(200).json({ ok: true });
    return;
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    res.status(400).json({ ok: false, error: "Name, email, and message are required" });
    return;
  }

  if (name.length > MAX_NAME_LENGTH) {
    res.status(400).json({ ok: false, error: "Name is too long" });
    return;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ ok: false, error: "Message is too long" });
    return;
  }

  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ ok: false, error: "Email address is not valid" });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: `Website contact form <${FROM_EMAIL}>`,
      to: COMPANY_EMAIL,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      res.status(500).json({ ok: false, error: "Failed to send message" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Unexpected error sending email:", err);
    res.status(500).json({ ok: false, error: "Failed to send message" });
  }
}
