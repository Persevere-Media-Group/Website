import type { ReactNode } from "react";
import { PageSection, PageBookCall, BodyText } from "@/ui-components/custom/common-page-elements";
import { SectionDivider } from "@/ui-components/custom/wiggly-divider";
import { ChoosePersevereMark } from "@/ui-components/custom/choose-persevere-mark";
import {
  Hero,
  AboutMe,
  MyRole,
  Approach,
  HowItWorks,
  WhatsIncluded,
  AlwaysIncludedSection,
  Faqs,
} from "@/container-contents/service-page-sections";

// ---------------------------------------------------------------------------
// Types shared by ServicePersonPage below (rendered for both the keir and
// calum routes), its section components (service-page-sections.tsx), and
// their content (services-data.tsx).
// ---------------------------------------------------------------------------

export type ServicePersonName = "keir" | "calum";

// A single "stage" in the "How it all works" ScrollStack.
export interface ServiceStage {
  number: string;
  title: string;
  body: ReactNode;
}

// The full set of person-specific content for one services page. Everything
// that differs between the keir and calum pages lives in services-data.tsx
// under this shape; each section component pulls out just its own slice.
export interface ServicePageData {
  hero: ReactNode;
  intro: {
    name: string;
    words: string[];
    note?: string;
  };
  role: {
    paragraph: ReactNode;
    maxWidthClassName?: string;
  };
  approach: ReactNode[];
  stages: ServiceStage[];
  included: {
    heading: ReactNode;
    items: ReactNode[];
  };
  alwaysIncludedBodies: [ReactNode, ReactNode, ReactNode];
  faqs: { q: string; a: ReactNode }[];
}

// ---------------------------------------------------------------------------
// Full page - the single source of truth for both /ads and /creative, which
// differ only in which name they pass down (all the actual copy differences
// live in services-data.tsx).
// ---------------------------------------------------------------------------

export function ServicePersonPage({ name }: { name: ServicePersonName }) {
  return (
    <PageSection>
      <Hero name={name} />

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-20 sm:pt-20">
        <AboutMe name={name} />
        <MyRole name={name} />
        <br />
        <SectionDivider />
        <Approach name={name} />
        <SectionDivider reverse />
        <HowItWorks name={name} />
        <SectionDivider />
        <WhatsIncluded name={name} />
        <AlwaysIncludedSection name={name} />
        <SectionDivider reverse />
        <Faqs name={name} />
        <SectionDivider />

        <div className="mt-4 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="font-subtitle text-[clamp(2.6rem,6.4vw,3.75rem)] font-black leading-tight tracking-wide text-(--color-oxblood) sm:whitespace-nowrap">
            We are your growth partners.
          </h2>
          <BodyText>
            We’re not here to ghost you after signing you on. We want to scale with you, keep
            improving with you, and never settle for "good enough."
          </BodyText>
        </div>

        <div className="mt-16 flex w-full items-center justify-center">
          <ChoosePersevereMark />
        </div>
      </div>

      <PageBookCall />
    </PageSection>
  );
}
