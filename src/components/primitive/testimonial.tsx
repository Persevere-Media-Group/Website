import type { ReactNode } from "react";
import AnimatedContent from "@/components/primitive/animated-content";
import ThreeDCard from "@/components/primitive/3d-card";

// ---------------------------------------------------------------------------
// Generic testimonials grid. Carries no content of its own, callers supply
// the quotes via the `testimonials` prop.
// ---------------------------------------------------------------------------

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
  /** 1-5, omit to hide the star row entirely */
  rating?: number;
};

function QuoteMark() {
  return (
    <svg
      width="36"
      height="32"
      viewBox="0 0 44 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-(--color-amber-gold)"
    >
      <path
        d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203"
        fill="currentColor"
      />
    </svg>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={filled ? "text-(--color-amber-gold)" : "text-(--color-oxblood)/15"}
    >
      <path
        d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z"
        fill="currentColor"
      />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <ThreeDCard
      className="h-full"
      innerClassName="h-full w-80 rounded-3xl overflow-visible"
      enableGlow={false}
      enableShadow={false}
      enableBorder={false}
    >
      <div className="flex h-full w-80 flex-col items-start gap-3 rounded-3xl border border-(--color-oxblood)/15 bg-(--color-ivory-raised) p-6 shadow-[0_12px_44px_-18px_rgba(74,31,29,0.25)]">
        <QuoteMark />

        {testimonial.rating != null && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} filled={i < testimonial.rating!} />
            ))}
          </div>
        )}

        <p
          className="mt-1 text-[clamp(0.9rem,1.4vw,0.98rem)] leading-relaxed text-(--color-oxblood)/80"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {testimonial.quote}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-3">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="size-11 shrink-0 rounded-full border border-(--color-oxblood)/15 object-cover"
            />
          ) : (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-(--color-terracotta) bg-(--color-ivory) text-sm font-bold text-(--color-terracotta)">
              {initials(testimonial.name)}
            </span>
          )}
          <div>
            <p className="font-bold text-(--color-oxblood)">{testimonial.name}</p>
            {testimonial.role && (
              <p
                className="text-sm text-(--color-oxblood)/60"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {testimonial.role}
              </p>
            )}
          </div>
        </div>
      </div>
    </ThreeDCard>
  );
}

export function Testimonials({
  testimonials,
  heading = "What people say",
  subheading,
  className = "",
}: {
  testimonials: Testimonial[];
  heading?: ReactNode;
  subheading?: string;
  className?: string;
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className={`px-4 py-12 text-center ${className}`}>
      <h2 className="mt-3 font-pomelo-mono text-[clamp(2.25rem,5vw,3.25rem)] font-black tracking-wide text-(--color-oxblood)">
        {heading}
      </h2>
      {subheading && (
        <p
          className="mx-auto mt-4 max-w-2xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {subheading}
        </p>
      )}

      <div className="mx-auto mt-16 flex max-w-5xl flex-wrap justify-center gap-8 text-left">
        {testimonials.map((testimonial, i) => (
          <AnimatedContent
            key={i}
            direction="vertical"
            distance={40}
            duration={0.7}
            ease="power3.out"
            threshold={0.2}
            delay={(i % 3) * 0.1}
          >
            <TestimonialCard testimonial={testimonial} />
          </AnimatedContent>
        ))}
      </div>
    </section>
  );
}
