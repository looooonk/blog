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
