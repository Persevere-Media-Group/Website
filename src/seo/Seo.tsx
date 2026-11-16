import { useLocation } from "react-router-dom";
import { seoConfig, SITE_URL, DEFAULT_IMAGE } from "./seoConfig";

// React 19 hoists <title>/<meta>/<link> rendered anywhere in the tree into
// document.head automatically, so no head-management library is needed here.
export function Seo() {
  const { pathname } = useLocation();
  const page = seoConfig[pathname] ?? seoConfig["/"];
  const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

  return (
    <>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      {page.noindex && <meta name="robots" content="noindex" />}
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={canonical} />
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
            logo: `${SITE_URL}/logo.png`,
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
