"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type SearchPost = {
  slug: string;
  title: string;
  tags: string[];
};

export default function PostSearch({ posts }: { posts: SearchPost[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return posts.filter((post) => {
      const title = post.title.toLowerCase();
      const tags = post.tags.map((tag) => tag.toLowerCase());

      return (
        title.includes(normalizedQuery) ||
        tags.some((tag) => tag.includes(normalizedQuery))
      );
    });
  }, [normalizedQuery, posts]);

  return (
    <section aria-label="Search posts" className="space-y-3">
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={15}
          strokeWidth={1.8}
        />
        <input
          aria-label="Search posts by title or tag"
          className="w-full rounded-sm border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts"
          type="search"
          value={query}
        />
      </div>

      {normalizedQuery ? (
        <div className="grid gap-2">
          {results.length ? (
            results.map((post) => (
              <Link
                className="rounded-sm border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
                href={`/${post.slug}`}
                key={post.slug}
              >
                <span className="block font-medium leading-snug text-foreground">
                  {post.title}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {post.tags.map((tag) => `#${tag}`).join(" ")}
                </span>
              </Link>
            ))
          ) : (
            <p className="rounded-sm border border-border px-3 py-2 text-sm text-muted-foreground">
              No matching posts
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
