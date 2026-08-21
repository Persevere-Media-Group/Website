import { Link } from "react-router-dom";
import { GrainWave } from "@/components/custom/grain-wave";
import { getAllPosts } from "@/lib/blog";

// NOTE: the <section> deliberately has no padding of its own. Any padding here would
// push GrainWave down from the top of the page and stop it reaching the screen edges,
// so the padding lives on the content wrapper below the band instead (same pattern
// used on the Contact and About pages).
export function Blog() {
  const posts = getAllPosts();

  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <GrainWave height="24rem">
        <h1 className="mt-3 font-heading text-[clamp(4.5rem,10vw,7.5rem)] tracking-wide text-(--color-ivory)">
          Blog
        </h1>
      </GrainWave>

      {posts.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 px-4 pt-16 pb-24 text-center sm:pt-20">
          <h2 className="font-subtitle text-[clamp(2rem,5vw,3.5rem)] font-black tracking-wide text-(--color-oxblood)">
            Blog page placeholder
          </h2>
          <p className="max-w-xl text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-(--color-oxblood)/80">
            Real content goes here once it's ready.
          </p>
        </div>
      ) : (
        <div className="flex w-full max-w-3xl flex-col gap-10 px-4 pt-16 pb-24 sm:pt-20">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="flex flex-col gap-2 text-left"
            >
              <h2 className="font-subtitle text-[clamp(1.5rem,3.5vw,2.25rem)] font-black tracking-wide text-(--color-oxblood)">
                {post.title}
              </h2>
              <p className="text-sm text-(--color-oxblood)/60">
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {post.excerpt && (
                <p className="max-w-xl leading-relaxed text-(--color-oxblood)/80">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
