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
    content: String.raw`
The goal for this site is simple: keep a public trail of what I am learning and what I keep rebuilding. The portfolio is the stable surface. The blog is the working surface.

## What belongs here

- Implementation notes that are likely to help future me.
- Research sketches before they become polished claims.
- Small essays about tools, models, and interfaces.

The rule of thumb is:

$$
\text{publish}(x) = \frac{\text{useful}(x) + \text{specific}(x)}{\text{performative}(x) + 1}
$$

That is not a real metric, but it captures the bias: write things that name concrete tradeoffs.

## A minimal post model

The blog data is intentionally boring. Each post carries metadata and markdown content:

~~~ts
type BlogPost = {
  slug: string;
  timestamp: string;
  title: string;
  subtitle?: string;
  tags: string[];
  image: { src: string; alt: string };
  content: string;
};
~~~

That shape gives the homepage enough information to scan posts quickly, while the article page can focus on the writing.

| Field | Purpose |
| --- | --- |
| timestamp | Sort and display recency |
| tags | Make themes visible without adding taxonomy overhead |
| image | Give each post a stable visual identity |
| content | Keep the writing portable |

![Notebook-style cover image](/images/field-notes.png)

I expect most posts to start as private notes. When one becomes useful outside that context, it can move here with a timestamp and a better title.

Relevant references I keep nearby: [Next.js App Router documentation](https://nextjs.org/docs/app) and the [Markdown syntax guide](https://daringfireball.net/projects/markdown/syntax).
`,
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
    content: String.raw`
Markdown is not just a writing format. For a small blog, it is the contract between authoring and rendering. That contract should be narrow enough to trust and broad enough to avoid fighting the tool.

## Features worth supporting

1. Headings, paragraphs, emphasis, and lists.
2. Code fences with language labels.
3. Tables for compact comparisons.
4. Links and images.
5. Inline and block equations.

For example, inline math like \(L(\theta) = -\sum_i \log p_\theta(y_i \mid x_i)\) should sit inside a paragraph without breaking the reading flow.

~~~tsx
export default function PostPage() {
  return <article className="markdown-body">...</article>;
}
~~~

## Rendering expectations

| Markdown feature | Rendering goal |
| --- | --- |
| Code block | Preserve whitespace and expose language |
| Table | Keep columns readable on narrow screens |
| Image | Respect alt text and article width |
| Link | Make external navigation obvious |
| Equation | Render as math, not raw source text |

The implementation here does not try to become a full publishing engine. It supports the features I expect to use often, keeps the parser local, and leaves the content in a form that can move to MDX later if the site needs component-level authoring.
`,
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
    content: String.raw`
A useful small model is not necessarily a weak model. It is a model whose mistakes can still be inspected without a week of infrastructure work.

## The baseline test

Before making a system larger, I like to ask:

> Can I explain the strongest failure case without inventing a new evaluation protocol?

If the answer is no, the next step is usually instrumentation rather than scale.

One compact way to describe the tradeoff is:

$$
\Delta = \frac{\text{signal}}{\text{complexity}}
$$

Where a higher \(\Delta\) means the change taught me more per unit of added machinery.

## A practical checklist

- Keep one boring baseline.
- Save the exact prompt or configuration that produced a surprising result.
- Track a small table of hand-inspected failures.
- Prefer changes that make errors easier to name.

| Change | Good sign | Bad sign |
| --- | --- | --- |
| More data | Fewer repeated failures | New failures are harder to classify |
| Larger model | Same rubric still applies | Only aggregate metrics improve |
| More tools | Tool use is sparse and useful | Tool use hides core errors |

This is not an argument against scale. It is an argument for earning it.
`,
  },
] satisfies BlogPost[];

export const allPosts = [...posts].sort(
  (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
);

export function getPost(slug: string) {
  return allPosts.find((post) => post.slug === slug);
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
