## Standalone contact form API

This folder is a separate Vercel project, deployed independently from the main
GitHub Pages site (this repo's root). It exists solely to run
`api/send-email.ts` — the serverless function GitHub Pages can't run itself.

### Deploying

1. In the Vercel dashboard, create a new project from this same GitHub repo.
2. Set its **Root Directory** to `email-api`.
3. In that project's Settings → Environment Variables, add `RESEND_API_KEY`
   with your Resend API key.
4. In `api/send-email.ts`, replace `COMPANY_EMAIL` with the real inbox
   submissions should land in.
5. Deploy. Note the resulting `*.vercel.app` URL (or a custom domain if you
   add one).
6. Back in the main site, update `CONTACT_API_URL` in
   [`src/containers/Contact.tsx`](../src/containers/Contact.tsx) to that URL, then
   redeploy the main site.

`ALLOWED_ORIGINS` in `api/send-email.ts` must include whatever origin the
contact form is actually served from (`https://choosepersevere.com` and
`http://localhost:5173` are already listed).
