import { PageHero, PageSection, PageBookCall } from "@/ui-components/custom/common-page-elements";
import { BlogListSection } from "@/container-contents/blog-sections";

export function Blog() {
  return (
    <PageSection>
      <PageHero grainy>Blog</PageHero>

      <BlogListSection />

      <PageBookCall />
    </PageSection>
  );
}
