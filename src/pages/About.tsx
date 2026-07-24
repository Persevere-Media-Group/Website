export function About() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-(--color-ivory) px-4 pt-32 pb-24 text-center">
      <p
        className="text-[clamp(0.75rem,1.6vw,0.95rem)] font-semibold uppercase tracking-[0.2em] text-(--color-oxblood)/60"
        style={{ fontFamily: "var(--font-body)" }}
      >
        About
      </p>
      <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight text-(--color-oxblood)">
        About page placeholder
      </h1>
      <p
        className="max-w-xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Real content goes here once it's ready.
      </p>
    </section>
  );
}
