import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { GrainWave } from "@/components/custom/grain-wave";
import { NotFound } from "@/pages/NotFound";
import { getPostBySlug } from "@/lib/blog";

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <NotFound />;
  }

  return (
    <section className="flex min-h-screen flex-col items-center bg-(--color-ivory)">
      <GrainWave height="24rem">
        <h1 className="mt-3 font-heading text-[clamp(3.25rem,7.5vw,5.5rem)] tracking-wide text-(--color-ivory)">
          {post.title}
        </h1>
      </GrainWave>

      <div className="flex w-full max-w-2xl flex-col gap-6 px-4 pt-16 pb-24 sm:pt-20">
        <p className="text-sm text-(--color-oxblood)/60">
          {new Date(post.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {post.image && <img src={post.image} alt="" className="w-full rounded-lg object-cover" />}

        <div className="prose max-w-none text-(--color-oxblood)">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
