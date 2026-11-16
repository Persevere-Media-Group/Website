import { useLocation } from "react-router-dom";
import { getPostBySlug } from "@/lib/blog";
import { seoConfig, SITE_URL, DEFAULT_IMAGE, type SeoEntry } from "./seoConfig";

const NOT_FOUND_PAGE: SeoEntry = {
  title: "Page Not Found | Persevere Media",
  description: "This page could not be found.",
  noindex: true,
};

// Unknown paths get a noindex 404 title rather than silently inheriting the
// homepage's tags, which would give search engines a duplicate of "/" under
// every mistyped URL. Individual blog posts have no seoConfig entry of their own.
function getPage(pathname: string): SeoEntry & { isNotFound?: boolean } {
  if (seoConfig[pathname]) return seoConfig[pathname];

  const slug = pathname.match(/^\/blog\/([^/]+)$/)?.[1];
  const post = slug ? getPostBySlug(slug) : undefined;
  if (post) {
    return {
      title: `${post.title} | Persevere Media`,
      description: post.excerpt ?? seoConfig["/blog"].description,
    };
  }

  return { ...NOT_FOUND_PAGE, isNotFound: true };
}

// React 19 hoists <title>/<meta>/<link> rendered anywhere in the tree into
// document.head automatically, so no head-management library is needed here.
export function Seo() {
  const location = useLocation();
  // GitHub Pages serves /about/ as well as /about, so treat a trailing slash as the same page
  const pathname = location.pathname.length > 1 ? location.pathname.replace(/\/$/, "") : "/";
  const page = getPage(pathname);
  const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

  return (
    <>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      {page.noindex && <meta name="robots" content="noindex" />}
      {!page.isNotFound && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      {!page.isNotFound && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:site_name" content="Persevere Media" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      {pathname === "/" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Persevere Media",
            url: SITE_URL,
            logo: `${SITE_URL}/logos/persevere-mark.png`,
            sameAs: [
              "https://www.instagram.com/persevere.media/",
              "https://www.instagram.com/keirdoesads/",
              "https://www.instagram.com/calummakesvideos/",
            ],
          })}
        </script>
      )}
    </>
  );
}
