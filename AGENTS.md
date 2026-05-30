## Base Guidelines
- Be succint in your code, but be wary of over-simplification. Prefer to reduce verbose code and variables, but do not move into the territory of "black magic code".

## Comments Guidelines
- Be succint in your comments, and do not over-comment.
- Never add comments to anything that can be easily understood by a programmer just by looking at the code.
- Never add any non-ascii characters to your comments, such as em dashes, greek letters, etc. If really needed, replace with LaTeX equivalents.
- Do not use "delimiter comments" such as "------------". If such delimiters are needed, perhaps it is a better idea to split the file into multiple.

## Next.js
- This is Next.js 16. Read the relevant guide in `node_modules/next/dist/docs/` before changing App Router, metadata, image, routing, or build behavior.
- Dynamic route page props use promise-shaped `params`, for example `params: Promise<{ slug: string }>`.
- Keep the app in the App Router unless there is a clear reason to add Pages Router files.

## Styling
- `https://github.com/looooonk/portfolio` is a portfolio app and is the styling reference for this blog.
- Match its quiet serif typography, HSL CSS variables, class-based dark mode, narrow borders, and small radii.
- Do not introduce a separate design system or broad color palette unless the portfolio styling changes first.

## Blog Content
- Posts are defined in `app/lib/posts.ts` and rendered through `app/components/markdown.tsx`.
- Each post should include `timestamp`, `title`, `tags`, optional `subtitle`, `image`, and `content`.
- Keep markdown portable. Prefer ordinary markdown syntax over JSX-like content.
- Cover images should live under `public/images` and include useful alt text.

## Testing
- All lints should be done through `npm run lint` only.
- Do not use the browser itself for tests.
- Do not leave the local website running after you are done implementing.
