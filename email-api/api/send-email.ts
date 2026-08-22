import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

// REMINDER (before deploying):
// 1. Set RESEND_API_KEY in this Vercel project's environment variables. Do not put the
//    real key in this file or in any .env file that gets committed.
// 2. Once you're ready for production, verify a sending domain in the Resend
//    dashboard, then update FROM_EMAIL to use it instead of the default
//    onboarding@resend.dev address, which is fine for testing but looks less
//    trustworthy to recipients and has lower deliverability limits.
// 3. Set RECAPTCHA_SECRET_KEY in this Vercel project's environment variables. It
//    pairs with the site key hardcoded in src/containers/Contact.tsx on the main site.
const COMPANY_EMAIL = "keir@choosepersevere.com";
const FROM_EMAIL = "onboarding@resend.dev";

// reCAPTCHA v3 returns a 0-1 score instead of a pass/fail challenge, lower means
// more bot-like. Google's own docs suggest 0.5 as a starting threshold.
const RECAPTCHA_MIN_SCORE = 0.5;

// This function is deployed as its own Vercel project, separate from the main
// GitHub Pages site, so cross-origin requests need explicit CORS headers.
// Keep this in sync with the domains the contact form is actually served from.
const ALLOWED_ORIGINS = new Set(["https://choosepersevere.com", "http://localhost:5173"]);

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactBody {
  name?: unknown;
  email?: unknown;
  business?: unknown;
  website?: unknown;
  service?: unknown;
  budget?: unknown;
  message?: unknown;
  timeframe?: unknown;
  honeypot?: unknown;
  recaptchaToken?: unknown;
}

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function isHuman(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY is not set");
    return false;
  }

  const params = new URLSearchParams({ secret, response: token });
  const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const result = (await verifyRes.json()) as RecaptchaVerifyResponse;

  return (
    result.success && result.action === "contact_form" && (result.score ?? 0) >= RECAPTCHA_MIN_SCORE
  );
}

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (typeof origin === "string" && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

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

  const recaptchaToken = typeof body.recaptchaToken === "string" ? body.recaptchaToken : "";
  if (!recaptchaToken || !(await isHuman(recaptchaToken))) {
    res.status(400).json({ ok: false, error: "Verification failed. Please try again." });
    return;
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const business = typeof body.business === "string" ? body.business.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";
  const service = typeof body.service === "string" ? body.service.trim() : "";
  const budget = typeof body.budget === "string" ? body.budget.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const timeframe = typeof body.timeframe === "string" ? body.timeframe.trim() : "";

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

  // optional fields only render a row when the visitor actually filled them in
  const optionalRows = [
    ["Business", business],
    ["Website", website],
    ["What they're after", service],
    ["Monthly ad spend", budget],
    ["Timeframe", timeframe],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`)
    .join("\n");

  try {
    const { error } = await resend.emails.send({
      from: `Website contact form <${FROM_EMAIL}>`,
      to: COMPANY_EMAIL,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${optionalRows}
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
