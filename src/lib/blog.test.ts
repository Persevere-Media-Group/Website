import { describe, expect, it } from "vitest";
import { slugFromPath, sortPostsByDateDesc, type BlogPost } from "./blog";

describe("slugFromPath", () => {
  it("strips the directory and .md extension", () => {
    expect(slugFromPath("/content/blog/my-first-post.md")).toBe("my-first-post");
  });

  it("handles a bare filename with no directory", () => {
    expect(slugFromPath("my-first-post.md")).toBe("my-first-post");
  });
});

describe("sortPostsByDateDesc", () => {
  const post = (slug: string, date: string): BlogPost => ({
    slug,
    title: slug,
    date,
    body: "",
  });

  it("orders posts from newest to oldest", () => {
    const posts = [post("a", "2024-01-01"), post("b", "2025-06-15"), post("c", "2023-12-25")];
    expect(sortPostsByDateDesc(posts).map((p) => p.slug)).toEqual(["b", "a", "c"]);
  });

  it("does not mutate the input array", () => {
    const posts = [post("a", "2024-01-01"), post("b", "2025-06-15")];
    const original = [...posts];
    sortPostsByDateDesc(posts);
    expect(posts).toEqual(original);
  });
});
