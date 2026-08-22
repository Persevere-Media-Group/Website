import { Highlighter } from "@/ui-components/primitive/highlighter";
import { GrainHeading } from "@/ui-components/primitive/grain-heading";
import { UNDERLINE_COLOR, HIGHLIGHT_COLOR, MARK_PROPS } from "@/container-contents/services-shared";
import { FaqLink } from "@/ui-components/custom/faq";
import type { ServicePageData, ServicePersonName } from "@/containers/ServicePage";

// ---------------------------------------------------------------------------
// All copy for the two services pages, keyed by person. ServicePersonPage
// (in ServicePage.tsx) just looks itself up here by name and renders
// whatever comes back.
// ---------------------------------------------------------------------------

const SERVICE_DATA: Record<ServicePersonName, ServicePageData> = {
  keir: {
    hero: (
      <h1 className="mt-3 text-center">
        <GrainHeading text="Ads" className="text-[clamp(6rem,14vw,10rem)]" />
      </h1>
    ),

    intro: {
      name: "Keir",
      words: [
        "ad manager",
        "creative strategist",
        "PPC strategist",
        "strategy designer",
        "growth partner",
      ],
      note: "When I'm not working on your ad campaigns, you can find me at Edinburgh Filmhouse watching movies, running, listening to new albums, or trying out a new coffee shop!",
    },

    role: {
      paragraph: (
        <>
          I lead all things Paid Media, such as Paid social and PPC. I build and run it properly; no
          setting and forgetting here! I have over{" "}
          <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
            5+ years of experience
          </Highlighter>
          , managing{" "}
          <Highlighter action="highlight" color={HIGHLIGHT_COLOR} {...MARK_PROPS}>
            £20m+ in ad spend
          </Highlighter>{" "}
          across a huge variety of sectors and niches. I've managed budgets from{" "}
          <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
            £1,000
          </Highlighter>{" "}
          a month to{" "}
          <Highlighter action="underline" color={UNDERLINE_COLOR} {...MARK_PROPS}>
            £500,000
          </Highlighter>{" "}
          a month. Whatever your niche, I've (probably) worked it.
        </>
      ),
    },

    approach: [
      <>
        At Persevere, getting strong results from your campaigns doesn't just come from a magic
        algorithm or an AI agent. <strong>It comes from us.</strong> Real people with years of real
        experience, designing a bespoke strategy. We consistently test and learn from the data and
        constantly evolve your campaign. We're not about leaving your account on autopilot.
      </>,
    ],

    stages: [
      {
        number: "1",
        title: "Welcome Aboard!",
        body: "Before we touch a single campaign, we want to know your business inside out; your customers, their problems and what's stopping them from buying.",
      },
      {
        number: "2",
        title: "Groundwork",
        body: "We delve deeper into the technical details. We audit your current campaigns, your website and your analytics. We also set up your tracking to measure real results.",
      },
      {
        number: "3",
        title: "Build",
        body: "Shooting, editing and fine tuning your creatives. We will also get to work on designing your campaign strategy. It doesn't stop once it's built- strategy keeps evolving as we learn more, because we're driven by the data, not by what we planned on day one.",
      },
      {
        number: "4",
        title: "Launch",
        body: "This is where the real learning starts; absorbing everything the campaigns tell us and feeding it straight back into the strategy. Continuous improvement isn't a 'nice to have', it's essential!",
      },
      {
        number: "5",
        title: "Growth",
        body: "When it's working, we don't sit back. We scale it, and we keep improving as we go. We're your growth partner, We're not interested in settling.",
      },
    ],

    included: {
      heading: "Business Partners (with Benefits)",
      items: [
        "We are a no BS team who will tell you what you need to hear, not what you want to hear.",
        "We are seasoned pros, if we do say so ourselves. We have been there and done it, time and again.",
        "We have offer you creative and performance services under one roof, so you don't have to choose between one or the other.",
        "A team who genuinely cares about your business, and will stick around, not ghost you after you've onboarded.",
      ],
    },

    // paired by index with the shared ALWAYS_INCLUDED_HEADINGS in services-shared.tsx
    // (monthly calls/weekly check-ins, direct access, reporting)
    alwaysIncludedBodies: [
      "A check in every week. A proper call every month, going through what's working, what's changed, and what's next. We are part of your team!",
      <>
        A dedicated group chat with the two of us, to discuss day-to-day performance, and to feel
        like an extension of your team. We want to give you real access, not an account manager
        relaying messages. <em>(Not at 11pm though, we've got lives too.)</em>
      </>,
      "We'll help you get set up with tools that keep the numbers clear and trustworthy, not vanity metrics dressed up to make us look good. We want your business to actually do well, not just make us look good.",
    ],

    faqs: [
      {
        q: "How much ad spend do you recommend?",
        a: (
          <>
            Ad spend goes directly to the platforms themselves (Meta, Google, TikTok, wherever),
            separate from our management fee. We work across a wide range of ad spend budgets, from
            four figures a month to six. As a starting point, we'd recommend reserving at least{" "}
            <Highlighter action="circle" color={UNDERLINE_COLOR} {...MARK_PROPS} padding={8}>
              £500 a month
            </Highlighter>{" "}
            for that ad spend alone, so the platform actually has enough to work with, though this
            varies by sector and goals. Not sure what's realistic for you?
            <FaqLink to="/contact">Get in touch and we can walk you through it!</FaqLink>
          </>
        ),
      },
      {
        q: "Do you handle the creative too, or just the ads?",
        a: (
          <>
            Both. Creative and paid are handled under one roof, from scripting and shooting through
            to the campaigns themselves, so nothing gets lost in translation between an ads agency
            and a separate content team.
            <FaqLink to="/services/calum">Check out the Creative service for more details</FaqLink>
          </>
        ),
      },
      {
        q: "How often will I hear from you?",
        a: "A proper reporting call every month, plus direct access to us via group chat in between. No account manager standing in the way.",
      },
      {
        q: "How long before I see results?",
        a: "The unfortunate and realistic answer is, it depends. We don't want to sit here and promise you the world just so you come onboard. But we can guarantee you that we will do everything in our power to make sure that results start flowing in as quickly as possible.",
      },
      {
        q: "Are there long-term contracts?",
        a: "We ask for an initial three-month commitment. It takes time for the platforms to gather enough data to optimise properly, and chopping and changing every few weeks works against you, not for you. After three months, you're free to roll monthly (we'd love to have you!), no long lock-ins, no small print.",
      },
      {
        q: "How do we get started?",
        a: (
          <>
            Every plan is built around your budget, goals, and the platforms that actually make
            sense for your business, not a one-size-fits-all package. The best way to find out what
            that looks like for you is a conversation, not a price list.
            <FaqLink to="/contact">Send us a message to find out how we can help you!</FaqLink>
          </>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------
  calum: {
    hero: (
      <h1 className="mt-3 text-center">
        <GrainHeading text="Creative" className="text-[clamp(6rem,14vw,10rem)]" />
      </h1>
    ),

    intro: {
      name: "Calum",
      words: [
        "photographer",
        "editor",
        "videographer",
        "ad creator",
        "content strategist",
        "growth partner",
      ],
      note: "If I’m not shooting or editing new content for your brand, I’m probably out on a hill somewhere in my tent or training for my next race. Or reading or watching some sort of fantasy fiction. Massive nerd, lover of adventure.",
    },

    role: {
      maxWidthClassName: "max-w-xl",
      paragraph:
        "I lead video, photography and organic social at Persevere. I have been a photographer, videographer and editor for over 7 years. I've worked with a diverse range of businesses and industries. I've created content for local car dealerships and global conferences alike. At Persevere, we build content as one unified system, not a pile of disconnected posts.",
    },

    approach: [
      "Organic growth isn't about posting more or always hopping on the newest trend. The platforms don't care how many followers you have- they care whether people save it, share it and actually watch it.",
      "We build for the signals that actually matter. This takes time. We're honest about that from the start. Any agency promising overnight virality is either guessing or lying and we'd rather tell you the truth and earn your trust properly.",
      "This works best if you care about real growth, not just likes, and you're ready to give it a proper runway. It's probably not for you if you're chasing a one-off viral moment.",
    ],

    stages: [
      {
        number: "1",
        title: "Welcome Aboard!",
        body: "Before a camera comes out, we want to know your business inside out. Your customers, their pain points, the problem you solve and how you solve it differently.",
      },
      {
        number: "2",
        title: "Groundwork",
        body: "We take pre-production seriously. Scripting, planning the shoot day, working out which formats do which job for your brand.",
      },
      {
        number: "3",
        title: "Build",
        body: "Shoot day. One or two half-day shoots a month is a great place to start, but we’re adaptable to what your business actually needs. Then the real craft: editing, colour grading, captioning, all done professionally. No Capcut templates here.",
      },
      {
        number: "4",
        title: "Launch",
        body: "The content goes live. We manage the posting ourselves, this isn't a 'here are your files, good luck!' handover.",
      },
      {
        number: "5",
        title: "Growth",
        body: "When something's working, we lean into it. We keep sharpening the strategy as we learn what your specific audience actually responds to. We're your growth partner.",
      },
    ],

    included: {
      heading: "What's included in the Creative package?",
      items: [
        "Shoots for paid and organic content, starting at one half-day a month and scaling with your needs",
        "Full production: editing, colour grading, and captioning to a professional standard",
        "A full range of formats: short-form video, long-form, VSLs, static graphics, and reels",
        "Organic social strategy and rollout, including posting, not just the content itself",
        "Platform strategy built around where your audience actually is, most often Instagram, TikTok, or YouTube",
      ],
    },

    // paired by index with the shared ALWAYS_INCLUDED_HEADINGS in services-shared.tsx
    // (monthly calls/weekly check-ins, direct access, reporting)
    alwaysIncludedBodies: [
      "A proper call each month to cover what's working, what's changed, and what's next, plus a weekly check-in so you're never left wondering how things stand.",
      "A group chat with the two of us. Real access, not an account manager relaying messages. (Not at 11pm though, we've got lives too.)",
      "Honest reporting on the signals that actually matter: saves, shares, watch-time. No vanity numbers dressed up to look good.",
    ],

    faqs: [
      {
        q: "Do I need any equipment?",
        a: "Nope! We handle all of it. Cameras, lighting, sound, the lot. You just need to show up.",
      },
      {
        q: "What if I'm not comfortable in front of a camera?",
        a: "Some founders love being the face of their brand. Others would rather not be. Either works. If you're happy on camera, we'll build content around you. If you're not as confident, we can help you become a natural in front of a camera lens, or discuss other ways to represent your brand.",
      },
      {
        q: "Do you handle the ads too, or just the content?",
        a: (
          <>
            Both. Content and paid are handled under one roof, from shoots and edits through to the
            campaigns themselves, so nothing gets lost in translation between a content team and a
            separate ads agency.
            <FaqLink to="/services/keir">Check out the Ads service for more details</FaqLink>
          </>
        ),
      },
      {
        q: "How long before I see results?",
        a: "The honest answer is, it depends, but organic growth is genuinely a three to six month game, not a three-week one. We won't promise overnight virality just to get you onboard. What we'll guarantee is a real strategy, properly executed, and total honesty about how it's tracking.",
      },
      {
        q: "Are there long-term contracts?",
        a: "We ask for an initial three-month commitment, same as our paid media work, but for a different reason. Organic growth is about understanding your audience's signals and continually refining the strategy around them, and that takes a bit of runway to do properly. After three months, you're free to roll monthly (we'd love to have you!), no long lock-ins, no small print.",
      },
      {
        q: "How do we get started?",
        a: (
          <>
            Every plan is built around what your business actually needs, from shoot frequency to
            platform mix. The best way to find out what that looks like for you is a conversation,
            not a price list.
            <FaqLink to="/contact">Send us a message to find out how we can help you!</FaqLink>
          </>
        ),
      },
    ],
  },
};

export function getServiceData(name: ServicePersonName): ServicePageData {
  return SERVICE_DATA[name];
}
