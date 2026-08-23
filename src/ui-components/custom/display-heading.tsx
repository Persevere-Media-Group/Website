import type { ReactNode } from "react";

interface DisplayHeadingProps {
  children: ReactNode;
  subheading?: ReactNode;
  headingClassName?: string;
}

const DEFAULT_HEADING_CLASSNAME =
  "mt-3 font-subtitle text-[clamp(2.25rem,5vw,3.25rem)] font-black tracking-wide text-(--color-oxblood)";

// The large section-intro heading + optional subheading used identically by the
// homepage's Our Services section and the Testimonials component.
export function DisplayHeading({ children, subheading, headingClassName }: DisplayHeadingProps) {
  return (
    <>
      <h2 className={headingClassName ?? DEFAULT_HEADING_CLASSNAME}>{children}</h2>
      {subheading && (
        <p className="mx-auto mt-4 max-w-2xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80">
          {subheading}
        </p>
      )}
    </>
  );
}
