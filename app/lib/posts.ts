import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

const postContentDirectory = path.join(process.cwd(), "content");
const postContentPrefix = "content/";

export interface BlogPost {
  slug: string;
  timestamp: string;
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
    slug: "why-this-blog-exists",
    timestamp: "2026-05-29T22:30:00+09:00",
    title: "Why this blog exists",
    subtitle:
      "A small place for notes that need more shape than a commit message and less ceremony than a paper.",
    tags: ["meta", "web"],
    image: {
      src: "/images/field-notes.png",
      alt: "Abstract notebook and browser window illustration",
    },
    content: "content/why-this-blog-exists.md",
  },
  {
    slug: "markdown-as-contract",
    timestamp: "2026-05-28T21:00:00+09:00",
    title: "Markdown as an interface contract",
    subtitle:
      "Markdown is useful because it is small, predictable, and easy to move between tools.",
    tags: ["markdown", "nextjs"],
    image: {
      src: "/images/markdown-contract.png",
      alt: "Abstract markdown document illustration",
    },
    content: "content/markdown-as-contract.md",
  },
  {
    slug: "small-model-notes",
    timestamp: "2026-05-27T18:45:00+09:00",
    title: "Notes on keeping small models honest",
    subtitle:
      "Before scaling a model or system, I want the small version to fail in legible ways.",
    tags: ["research", "notes"],
    image: {
      src: "/images/small-models.png",
      alt: "Abstract model evaluation chart illustration",
    },
    content: "content/small-model-notes.md",
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
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    timeZone: "Asia/Seoul",
    timeZoneName: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}
