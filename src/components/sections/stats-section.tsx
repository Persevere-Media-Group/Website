import AnimatedContent from "@/components/ui/AnimatedContent";

// placeholder copy, swap each of these once the real service summary text is ready
const BLOCKS = [
  {
    heading: "Placeholder heading 1",
    body: "Placeholder 1 body copy goes here, swap this out once the real content is ready.",
  },
  {
    heading: "Placeholder heading 2",
    body: "Placeholder 2 body copy goes here, swap this out once the real content is ready.",
  },
  {
    heading: "Placeholder heading 3",
    body: "Placeholder 3 body copy goes here, swap this out once the real content is ready.",
  },
];

export function StatsSection() {
  return (
    <section className="flex flex-col items-center gap-16 bg-(--color-ivory) px-4 py-24 text-center">
      {BLOCKS.map((block, i) => (
        <AnimatedContent
          key={block.heading}
          direction="vertical"
          distance={50}
          duration={0.8}
          ease="power3.out"
          threshold={0.2}
          delay={i * 0.15}
        >
          <div className="max-w-xl">
            <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight text-(--color-oxblood)">
              {block.heading}
            </h3>
            <p
              className="mt-3 text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {block.body}
            </p>
          </div>
        </AnimatedContent>
      ))}
    </section>
  );
}
