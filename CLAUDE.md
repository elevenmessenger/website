# 🤖 CLAUDE.md — website

Working notes for anyone (human or agent) changing the Eleven marketing site.
It's an [Eleventy](https://www.11ty.dev/) site: pages in `src/*.njk` share
`src/_includes/base.njk`, styles in `src/styles.css`, deployed to GitHub Pages on
every push to `main`. `npm run serve` previews, `npm run build` builds to `_site`.

## Who wrote this: AI vs human markers (🤖 / 👨)

Every page says who wrote it — out loud. Unlike the app repo, these markers
**render on the live site by design**: the 🤖 is a visible transparency signal to
visitors, not just a note to editors.

- **🤖 — written by an LLM.** Always **visible**, immediately before the heading
  or paragraph it applies to (`<h2>🤖 …</h2>`, or a leading `🤖 ` inside a `<p>`).
  A 🤖 on a heading **cascades**: it marks that heading and everything beneath it
  until the next heading of the same-or-higher level, or a human-certified block.
  So one 🤖 on a page's `<h1>` marks the whole page (that's how `privacy`,
  `security`, and `why-eleven` are stamped — a single 🤖 up top).
- **No marker — ambiguous.** Could be either. Never *assume* AI authorship.
- **A person emoji (👨 / 👤 / 🧑 …) — certified human, off-limits.** An LLM must
  not rewrite, rephrase, condense, or delete it. On this HTML site the human
  marker lives in a **hidden comment** right before the element — `<!-- 👨 -->` —
  so it fences the copy off without showing on the page. The 🤖 marker is never
  hidden.

Currently human (do not LLM-rewrite):
- `index.njk` — the hero `<h1>` "Take your group chat to Eleven." (and the
  matching `title`/`htmlTitle`).
- `index.njk` — the `<h2>` "Don't get mad. Get&nbsp;Eleven."

Transitions:
- Writing new copy → mark it 🤖.
- Substantially rewriting *unmarked* copy → it becomes 🤖.
- A human rewriting 🤖 copy removes the 🤖 (→ ambiguous), or adds `<!-- 👨 -->`
  to certify and lock it.
- Reached a `<!-- 👨 -->`-fenced block? Hands off — leave it exactly as is.
