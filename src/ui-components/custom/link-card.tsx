import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import AnimatedContent from "@/ui-components/primitive/animated-content";
import SquigglyArrow from "@/ui-components/primitive/squiggly-arrow";

// ---------------------------------------------------------------------------
// The bordered "learn more" card used for both the homepage's Our Services
// section and the About page's Roles section - same shell, different heading
// typography per caller (hence `headingClassName` rather than a fixed style).
// ---------------------------------------------------------------------------

interface LinkCardProps {
  to: string;
  heading: ReactNode;
  headingClassName: string;
  body: ReactNode;
  linkLabel: ReactNode;
  delay?: number;
}

export function LinkCard({
  to,
  heading,
  headingClassName,
  body,
  linkLabel,
  delay = 0,
}: LinkCardProps) {
  return (
    <AnimatedContent distance={40} duration={0.7} delay={delay} className="h-full">
      <div className="flex h-full flex-col gap-3 rounded-3xl border border-(--color-oxblood)/15 bg-(--color-ivory-raised) p-8 shadow-[0_12px_44px_-18px_rgba(74,31,29,0.25)]">
        <Link to={to} className="group/header w-fit">
          <h3
            className={cn(
              "transition-colors duration-300 group-hover/header:text-(--color-terracotta)",
              headingClassName
            )}
          >
            {heading}
          </h3>
        </Link>
        <p className="text-[clamp(0.95rem,1.5vw,1.05rem)] leading-relaxed text-(--color-oxblood)/80">
          {body}
        </p>
        <Link
          to={to}
          className="group mt-auto inline-flex w-fit items-center gap-1 text-[clamp(1.25rem,2.2vw,1.5rem)] font-subtitle font-bold text-(--color-terracotta) underline underline-offset-2"
        >
          <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-1">
            {linkLabel}
          </span>
          <SquigglyArrow
            width={165}
            height={82}
            strokeWidth={4}
            variant="bouncy"
            className="text-current"
          />
        </Link>
      </div>
    </AnimatedContent>
  );
}
