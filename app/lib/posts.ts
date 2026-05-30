import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

const postContentDirectory = path.join(process.cwd(), "content");
const postContentPrefix = "content/";

export interface BlogPost {
  slug: string;
  timestamp: string;
  location: string;
  title: string;
  subtitle?: string;
  tags: string[];
  image: {
    src: string;
    alt: string;
  };
  content: string;
}

const posts = [
  {
    slug: "why-blog",
    timestamp: "2026-05-30",
    location: "Seoul, South Korea",
    title: "Why blog?",
    subtitle:
      "Posts that require a bit more thought than a post on twitter, but a bit less thought than a LaTeX writeup.",
    tags: ["meta"],
    image: {
      src: "/images/field-notes.png",
      alt: "Abstract notebook and browser window illustration",
    },
    content: "content/why-blog.md",
  },
] satisfies BlogPost[];

export const allPosts = [...posts].sort(
  (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
);

export function getPost(slug: string) {
  return allPosts.find((post) => post.slug === slug);
}

export async function readPostContent(post: BlogPost) {
  const contentPath = post.content.startsWith(postContentPrefix)
    ? post.content.slice(postContentPrefix.length)
    : post.content;

  return readFile(path.join(postContentDirectory, contentPath), "utf8");
}

export function getAdjacentPosts(slug: string) {
  const index = allPosts.findIndex((post) => post.slug === slug);

  return {
    next: index > 0 ? allPosts[index - 1] : undefined,
    previous:
      index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : undefined,
  };
}

export function formatPostDate(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).format(new Date(timestamp));
}
