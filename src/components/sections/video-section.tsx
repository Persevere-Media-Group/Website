import AnimatedContent from "@/components/ui/AnimatedContent";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

// TODO: swap both of these out once real footage is ready.
// videoSrc: currently a placeholder sample video, replace with your actual video URL
// (a YouTube/Vimeo embed link, or a direct .mp4 URL) once footage is ready
// thumbnailSrc: currently a generated placeholder image, replace with a real still
// frame or a proper cover photo once you have one
const PLACEHOLDER_VIDEO_SRC = "https://www.youtube.com/embed/dQw4w9WgXcQ";
const PLACEHOLDER_THUMBNAIL_SRC =
  "https://placehold.co/1280x720/d5573b/f7f3e3?text=Video+Placeholder";

export function VideoSection() {
  return (
    <section className="flex flex-col items-center gap-6 bg-(--color-ivory) px-4 py-24 text-center">
      <AnimatedContent
        direction="vertical"
        distance={50}
        duration={0.8}
        ease="power3.out"
        threshold={0.2}
      >
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black tracking-tight text-(--color-oxblood)">
            What we're all about
          </h2>

          <div className="mt-8 w-full max-w-3xl">
            <HeroVideoDialog
              className="block"
              animationStyle="from-center"
              videoSrc={PLACEHOLDER_VIDEO_SRC}
              thumbnailSrc={PLACEHOLDER_THUMBNAIL_SRC}
              thumbnailAlt="Placeholder video, real footage coming soon"
            />
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
