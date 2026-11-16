import fm from "front-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  image?: string;
  excerpt?: string;
  body: string;
}

interface BlogFrontmatter {
  title: string;
  date: string;
  image?: string;
  excerpt?: string;
}

export function slugFromPath(path: string): string {
  return path.replace(/^.*\//, "").replace(/\.md$/, "");
}

export function sortPostsByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

const rawPosts = import.meta.glob("/content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const posts: BlogPost[] = Object.entries(rawPosts).map(([path, raw]) => {
  const { attributes, body } = fm<BlogFrontmatter>(raw);
  return {
    slug: slugFromPath(path),
    title: attributes.title,
    date: attributes.date,
    image: attributes.image,
    excerpt: attributes.excerpt,
    body,
  };
});

export function getAllPosts(): BlogPost[] {
  return sortPostsByDateDesc(posts);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
