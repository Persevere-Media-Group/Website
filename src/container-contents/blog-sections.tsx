import { Link } from "react-router-dom";
import { Placeholder } from "@/ui-components/custom/common-page-elements";
import { getAllPosts } from "@/lib/blog";

export function BlogListSection() {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return <Placeholder />;
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-10 px-4 pt-16 pb-24 sm:pt-20">
      {posts.map((post) => (
        <Link key={post.slug} to={`/blog/${post.slug}`} className="flex flex-col gap-2 text-left">
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
            <p className="max-w-xl text-justify leading-relaxed text-(--color-oxblood)/80">
              {post.excerpt}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
