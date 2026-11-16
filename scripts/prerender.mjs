// Runs after `vite build` + copy-404.mjs. GitHub Pages serves static files by
// filesystem match, so every route needs a real dist/<route>/index.html with
// actual rendered content - otherwise a request for e.g. /about only ever
// matches dist/404.html, which GitHub Pages serves with a genuine HTTP 404
// status (content is correct, since 404.html is a copy of the SPA shell, but
// Googlebot discards 404-status pages before it matters what they render).
//
// This boots the built app in a real headless browser (via `vite preview`,
// serving the actual dist/ output), visits each route, waits for it to mount
// and for src/seo/Seo.tsx to render that route's real title/meta tags, then
// splices the rendered #root content and head tags into a fresh copy of the
// pristine dist/index.html template and writes it to dist/<route>/index.html.
//
// Splicing into a fresh copy of the template (rather than serializing
// Puppeteer's live `page.content()`) matters: GTM/gtag/Meta Pixel's loader
// scripts mutate the DOM at runtime (e.g. GTM inserts its own <script src>
// tag). Capturing the live document would bake that mutation in as static
// markup - so the *next* real page load would run the still-present inline
// loader again on top of it, inserting a second copy and double-firing
// analytics. Splicing only the app's own output into an untouched template
// copy avoids that entirely; every tracking script stays exactly as
// originally authored, once, per file.
//
// The app uses plain `createRoot(...).render()` (not hydrateRoot), so this
// doesn't need to hydrate cleanly - React just replaces the prerendered
// #root content with a fresh client render on top, same as tools like
// react-snap.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { preview } from "vite";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

// Every route the router actually serves, except the wildcard catch-all (no
// single URL to visit) and /blog/:slug (no real posts exist yet - the blog
// index itself is already noindexed until it has content). The old
// /services/* paths are included because they exist purely so previously
// indexed/bookmarked links still resolve - that only works if crawlers get a
// 200, not the 404 they get today. By the time each is captured, its
// client-side <Navigate replace> has already resolved, so the spliced
// content/meta correctly reflect the page it redirects to.
const ROUTES = [
  "/",
  "/about",
  "/ads",
  "/creative",
  "/contact",
  "/privacy-policy",
  "/case-studies",
  "/blog",
  "/services",
  "/services/ads",
  "/services/creative",
  "/services/keir",
  "/services/calum",
];

// Every head tag src/seo/Seo.tsx can render for a route, matching what used
// to carry [data-default] in index.html before main.tsx strips it on boot.
// Scoped to `head > title` rather than a bare `title` - decorative icons
// elsewhere on the page (e.g. squiggly-arrow.tsx) render their own <title>
// for SVG accessibility, and an unscoped selector was scraping those into
// <head> too, producing several stray duplicate <title> tags per route.
const SEO_TAG_SELECTOR = [
  "head > title",
  'meta[name="description"]',
  'link[rel="canonical"]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
  'meta[name="robots"]',
  'script[type="application/ld+json"]',
].join(", ");

const distDir = resolve(process.cwd(), "dist");
const template = readFileSync(resolve(distDir, "index.html"), "utf-8");

const server = await preview({
  root: process.cwd(),
  build: { outDir: "dist" },
  preview: { port: 4173, strictPort: false, open: false },
});
const baseUrl = server.resolvedUrls.local[0];

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const outputs = [];

try {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.goto(`${baseUrl}${route.slice(1)}`, { waitUntil: "networkidle0" });
    // Confirms the app has mounted and Seo.tsx has had a chance to render
    // this route's real tags in place of the removed static defaults.
    await page.waitForSelector("title[data-default]", { hidden: true, timeout: 10000 });

    const rootHtml = await page.$eval("#root", (el) => el.innerHTML);
    const seoTagsHtml = await page.$$eval(SEO_TAG_SELECTOR, (els) =>
      els.map((el) => el.outerHTML).join("\n    ")
    );
    await page.close();

    const $ = cheerio.load(template);
    $("[data-default]").remove();
    $("head").append(`\n    ${seoTagsHtml}\n`);
    $("#root").html(rootHtml);

    const outFile =
      route === "/" ? resolve(distDir, "index.html") : resolve(distDir, `.${route}`, "index.html");
    outputs.push({ outFile, html: $.html() });
    console.log(`Prerendered ${route}`);
  }
} finally {
  await browser.close();
  await server.close();
}

// Written only after every route has been captured, so dist/index.html stays
// the pristine SPA shell (with [data-default] tags intact) for the SPA
// fallback that every other route's initial navigation relies on above.
for (const { outFile, html } of outputs) {
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
}
