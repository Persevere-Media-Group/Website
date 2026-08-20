import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types shared by the services pages (ServicesKeir / ServicesCalum), their
// section components (ServicePage.tsx), and their content (services-data.tsx).
// ---------------------------------------------------------------------------

export type ServicePersonName = "keir" | "calum";

// A single "stage" in the "How it all works" ScrollStack.
export interface ServiceStage {
  number: string;
  title: string;
  body: ReactNode;
}

// The full set of person-specific content for one services page. Everything
// that differs between ServicesKeir and ServicesCalum lives in services-data.tsx
// under this shape; each section component in ServicePage.tsx pulls out just
// its own slice.
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
    items: string[];
  };
  alwaysIncludedBodies: [ReactNode, ReactNode, ReactNode];
  faqs: { q: string; a: ReactNode }[];
}

export type SectionProps = { name: ServicePersonName };
