export const SITE_URL = "https://choosepersevere.com";
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export interface SeoEntry {
  title: string;
  description: string;
  noindex?: boolean;
}

export const seoConfig: Record<string, SeoEntry> = {
  "/": {
    title: "Persevere Media | Content & Paid Ads, Done Properly",
    description:
      "Persevere Media is a two-person growth partner combining paid ads and content creation under one roof. £20m+ in ad spend managed across 50+ brands — no account managers, no bloated fees.",
  },
  "/about": {
    title: "About Us | Persevere Media",
    description:
      "Meet Keir and Calum — the two people who actually do the work at Persevere Media, a paid ads and content agency built on getting stuck in, not handing you off.",
  },
  "/services/keir": {
    title: "Paid Ads Management | Persevere Media",
    description:
      "Bespoke Meta, TikTok, Google and Snapchat ad strategy. £20m+ in ad spend managed across budgets from £1k to £500k a month — no AI autopilot, no account managers.",
  },
  "/services/calum": {
    title: "Content & Creative That Converts | Persevere Media",
    description:
      "Thumb-stopping organic and paid social content — scripted, shot and edited by the same team running your ad campaigns.",
  },
  "/contact": {
    title: "Book a Call | Persevere Media",
    description: "Get in touch with Persevere Media to talk paid ads and content strategy for your business.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Persevere Media",
    description: "How Persevere Media collects, uses, and protects your information on choosepersevere.com.",
  },
  "/services": {
    title: "Our Services | Persevere Media",
    description: "Paid ads and content services from Persevere Media.",
    noindex: true, // placeholder page, remove once real content is added
  },
  "/case-studies": {
    title: "Case Studies | Persevere Media",
    description: "Real results from real Persevere Media clients.",
    noindex: true, // remove once real case studies are added
  },
  "/blog": {
    title: "Blog | Persevere Media",
    description: "Advice on paid ads and content from the Persevere Media team.",
    noindex: true, // remove once real posts are added
  },
};
