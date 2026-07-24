// runs after `vite build`, copies dist/index.html to dist/404.html so GitHub Pages
// serves your actual app for any unmatched path (like /about on a fresh load or
// hard refresh), instead of GitHub's own generic 404 page. the browser's URL stays
// whatever the visitor actually requested, so react-router still matches it correctly
// once your app boots up from this fallback file.
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");

copyFileSync(resolve(distDir, "index.html"), resolve(distDir, "404.html"));

console.log("Copied dist/index.html -> dist/404.html for GitHub Pages SPA fallback");
