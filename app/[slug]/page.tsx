import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Markdown from "@/app/components/markdown";
import {
  allPosts,
  formatPostDate,
  getAdjacentPosts,
  getPost,
  readPostContent,
} from "@/app/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  return {
    title: `${post.title} | Taehoon Hwang`,
    description: post.subtitle ?? post.title,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const content = await readPostContent(post);
  const { previous, next } = getAdjacentPosts(slug);
  const related = allPosts.filter((entry) => entry.slug !== slug);

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
      <article className="mx-auto max-w-3xl">
        <nav className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link className="font-medium text-foreground hover:text-muted-foreground" href="/">
            Back to posts
          </Link>
          <div className="flex flex-wrap gap-2 text-muted-foreground">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </nav>

        <header className="space-y-5 border-b border-border pb-8">
          <time className="text-sm text-muted-foreground" dateTime={post.timestamp}>
            {formatPostDate(post.timestamp)}
          </time>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              {post.title}
            </h1>
            {post.subtitle ? (
              <p className="text-lg leading-relaxed text-muted-foreground">
                {post.subtitle}
              </p>
            ) : null}
          </div>

          <Image
            alt={post.image.alt}
            className="aspect-[16/9] w-full rounded-sm border border-border object-cover grayscale-[10%]"
            height={900}
            loading="eager"
            src={post.image.src}
            width={1600}
          />
        </header>

        <Markdown content={content} />

        <footer className="mt-12 space-y-8 border-t border-border pt-8">
          <div className="grid gap-3 sm:grid-cols-2">
            {previous ? (
              <Link
                className="rounded-sm border border-border p-4 hover:bg-secondary"
                href={`/${previous.slug}`}
              >
                <span className="block text-sm text-muted-foreground">Previous</span>
                <span className="font-medium text-foreground">{previous.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                className="rounded-sm border border-border p-4 text-right hover:bg-secondary"
                href={`/${next.slug}`}
              >
                <span className="block text-sm text-muted-foreground">Next</span>
                <span className="font-medium text-foreground">{next.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <section aria-label="Other posts" className="space-y-3">
            <h2 className="text-base font-bold text-foreground">Other posts</h2>
            <div className="grid gap-2">
              {related.map((entry) => (
                <Link
                  className="flex items-center justify-between gap-4 rounded-sm border border-border px-3 py-2 text-sm hover:bg-secondary"
                  href={`/${entry.slug}`}
                  key={entry.slug}
                >
                  <span className="font-medium text-foreground">{entry.title}</span>
                  <time className="shrink-0 text-muted-foreground" dateTime={entry.timestamp}>
                    {formatPostDate(entry.timestamp)}
                  </time>
                </Link>
              ))}
            </div>
          </section>
        </footer>
      </article>
    </main>
  );
}
