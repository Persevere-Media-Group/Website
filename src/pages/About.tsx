import { PageHero, PageSection } from "@/components/custom/common-page-elements";
import { SectionDivider } from "@/components/custom/wiggly-divider";
import {
  RolesSection,
  OriginStorySection,
  ChooseSection,
  BookCallSection,
} from "@/pages/about-sections";

export function About() {
  return (
    <PageSection>
      <PageHero grainy>About Us</PageHero>

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-16 sm:pt-20">
        <RolesSection />
        <OriginStorySection />

        {/* SectionDivider only has its own 1rem py-4, no outer margin - matching the
          mt-24 the heading below already carries gives equal breathing room on both
          sides of the wavy line instead of it sitting flush against the section above */}
        <div className="mt-24">
          <SectionDivider />
        </div>

        <ChooseSection />
        <BookCallSection />
      </div>
    </PageSection>
  );
}
