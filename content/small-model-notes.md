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
