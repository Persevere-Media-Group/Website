import {
  PageHero,
  PageSection,
  SectionHeading,
  PageBookCall,
} from "@/ui-components/custom/common-page-elements";

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "Who we are",
    body: [
      'Persevere Media ("we", "us", "our") operates choosepersevere.com. By using this site you agree to these terms. If you don\'t agree with them, please don\'t use the site.',
    ],
  },
  {
    heading: "Using this site",
    body: [
      "You're welcome to browse the site and get in touch through it. Please don't misuse it. That includes trying to break or overload it, scraping it at scale, sending spam or abusive messages through the contact form, or using it for anything unlawful.",
    ],
  },
  {
    heading: "Our services",
    body: [
      "Descriptions of our paid ads and content services on this site are general information, not an offer or a contract. If you hire us, the specific scope, fees and timelines will be agreed with you in writing before work starts, and those agreed terms apply to that work.",
      "Where we manage ad campaigns, ad spend is paid to the advertising platforms and is separate from our fees, unless we agree otherwise in writing.",
    ],
  },
  {
    heading: "No guarantee of results",
    body: [
      "Results from paid ads and content depend on many things outside our control, including your product, pricing, budget, market and changes made by the ad platforms. Any results, figures or testimonials shown on this site describe past work and are not a promise of what you'll achieve.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      "Unless stated otherwise, the text, design, logos, photos, video and other content on this site belong to Persevere Media or are used with permission. You may view and share links to the site, but please don't copy, republish or sell our content without asking us first.",
      "Client names, logos and work shown on this site belong to their respective owners and are shown with their permission.",
    ],
  },
  {
    heading: "Third-party links and services",
    body: [
      "The site links to and uses third-party services, such as Instagram, Calendly and Google. We don't control those services and aren't responsible for their content or how they handle your data. Their own terms and policies apply when you use them.",
    ],
  },
  {
    heading: "Our liability",
    body: [
      "We work hard to keep the site accurate and available, but it's provided \"as is\". We can't promise it will always be error free or uninterrupted. To the fullest extent the law allows, we aren't liable for any loss arising from your use of, or inability to use, this site.",
      "Nothing in these terms limits liability that can't legally be limited, including liability for death or personal injury caused by negligence, or for fraud.",
    ],
  },
  {
    heading: "Your data",
    body: [
      "How we collect and use your personal information, including cookies and analytics, is explained in our Privacy Policy.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may update these terms from time to time. The date at the top of this page shows when they were last changed, and continuing to use the site after a change means you accept the updated terms.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of Scotland, and any dispute will be dealt with by the Scottish courts.",
    ],
  },
  {
    heading: "Contact us",
    body: ["If you have questions about these terms, contact us at hello@choosepersevere.com."],
  },
];

export function Terms() {
  return (
    <PageSection>
      <PageHero size="md">Terms</PageHero>

      <div className="flex w-full flex-col items-center px-4 pt-16 pb-24 text-center sm:pt-20">
        <SectionHeading size="lg" className="mt-2">
          The Legal Bits
        </SectionHeading>

        <div className="mt-10 max-w-2xl space-y-8 text-justify text-(--color-oxblood)/90">
          <p className="text-sm text-(--color-oxblood)/60">Last updated: 15th November 2026</p>

          {SECTIONS.map((section) => (
            <div key={section.heading} className="space-y-3">
              <h3 className="text-xl font-bold text-(--color-oxblood)">{section.heading}</h3>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <PageBookCall />
    </PageSection>
  );
}
