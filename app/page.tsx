import Link from "next/link";
import Image from "next/image";

import { allPosts, formatPostDate } from "@/lib/posts";

export default function Home() {
  const [featured, ...posts] = allPosts;

  return (
    <div className="min-h-screen">
      <div className="lg:flex lg:min-h-screen">
        <aside className="border-b border-border px-6 py-10 sm:px-10 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:flex-shrink-0 lg:border-b-0 lg:border-r xl:w-96">
          <div className="space-y-5 lg:mx-auto lg:max-w-xs">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Taehoon Hwang</p>
              <h1 className="text-3xl font-bold tracking-normal text-foreground">
                Notes
              </h1>
              <div className="h-px w-full bg-border" />
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Essays and technical notes on software, research, and building
              small systems that stay understandable.
            </p>

            <nav aria-label="Primary" className="flex gap-4 text-sm">
              <Link className="font-medium text-foreground hover:text-muted-foreground" href="/">
                Blog
              </Link>
              <a
                className="font-medium text-foreground hover:text-muted-foreground"
                href="https://github.com/looooonk"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-8 sm:px-10 lg:px-12 lg:py-10 xl:px-16">
          <section className="max-w-4xl">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_18rem]"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <time dateTime={featured.timestamp}>
                    {formatPostDate(featured.timestamp)}
                  </time>
                  <span aria-hidden="true">/</span>
                  <span>{featured.tags.join(", ")}</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                    {featured.title}
                  </h2>
                  {featured.subtitle ? (
                    <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {featured.subtitle}
                    </p>
                  ) : null}
                </div>

                <span className="inline-flex text-sm font-medium text-foreground group-hover:text-muted-foreground">
                  Read post
                </span>
              </div>

              <Image
                alt={featured.image.alt}
                className="aspect-[16/10] w-full rounded-sm border border-border object-cover grayscale-[10%]"
                height={900}
                loading="eager"
                src={featured.image.src}
                width={1600}
              />
            </Link>
          </section>

          <section className="max-w-4xl py-8" aria-label="All posts">
            <div className="grid gap-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group grid gap-4 rounded-sm border border-border bg-card p-4 transition-colors hover:bg-secondary sm:grid-cols-[12rem_minmax(0,1fr)]"
                >
                  <Image
                    alt={post.image.alt}
                    className="aspect-[16/10] w-full rounded-sm border border-border object-cover grayscale-[10%]"
                    height={900}
                    src={post.image.src}
                    width={1600}
                  />

                  <article className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <time dateTime={post.timestamp}>
                        {formatPostDate(post.timestamp)}
                      </time>
                      <span aria-hidden="true">/</span>
                      <span>{post.tags.join(", ")}</span>
                    </div>

                    <h2 className="text-xl font-bold leading-snug text-foreground group-hover:text-muted-foreground">
                      {post.title}
                    </h2>
                    {post.subtitle ? (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {post.subtitle}
                      </p>
                    ) : null}
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
