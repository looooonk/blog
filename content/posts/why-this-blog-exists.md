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

The blog data is intentionally boring. Each post carries metadata and a path to markdown content:

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
| content | Point to portable markdown |

![Notebook-style cover image](/images/field-notes.png)

I expect most posts to start as private notes. When one becomes useful outside that context, it can move here with a timestamp and a better title.

Relevant references I keep nearby: [Next.js App Router documentation](https://nextjs.org/docs/app) and the [Markdown syntax guide](https://daringfireball.net/projects/markdown/syntax).
