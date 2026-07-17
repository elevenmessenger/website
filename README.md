# Eleven Messenger — website

The marketing site for [Eleven Messenger](https://elevenmessenger.com), built
with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

## Develop

```sh
npm install
npm run serve   # local preview with live reload
npm run build   # build to ./_site
```

- Pages live in `src/`, sharing `src/_includes/base.njk`. They split in two:
  the marketing surface (home, features, families/communities/business,
  security, privacy) stays non-technical, and `/about/` is the hub that
  introduces the philosophy/infrastructure pages (story, openness, planet,
  planet-scale, nerds, why-eleven, everyone, self-host) — link nerdy things
  from About, not from the marketing pages.
- Styles are `src/styles.css`; design tokens are lifted from the product's own
  stylesheets (the app's "Classic" theme) so site and app read as one thing.
- `src/demo.css` frames the hero collage — real screenshots of the real apps
  (`src/assets/hero/`): the web app captured headlessly against a seeded demo
  space, the native Mac app's own window, and the iPhone app in the Simulator.
  When the product's look changes, re-capture rather than fake: seed a local
  instance over the real protocol, screenshot the real surfaces.
- `src/ambient.js` is the product's smoke-and-motes backdrop, CPU-capped
  (30fps, reduced particle counts, a single still frame under
  `prefers-reduced-motion`).
- `src/CNAME` pins the custom domain.

## Deploy

The site is built **locally** and published to the `gh-pages` branch, which
GitHub Pages serves directly (Pages "deploy from a branch" — **no GitHub
Actions**). From a clean checkout on `main`:

```sh
./deploy.sh
```

That runs `npx @11ty/eleventy` (→ `_site`, with `src/CNAME` and
`src/infrastructure/` passed through), adds `.nojekyll`, and force-pushes the
built output to `gh-pages`. The custom domain and HTTPS persist because `CNAME`
rides in the build. Live within about a minute.

Notes:

- `main` holds the **source**; `gh-pages` holds the **built output** and is
  overwritten by `deploy.sh` each time — never edit it by hand.
- The planet-scale guide under `src/infrastructure/` is mirrored from
  [`elevenmessenger/messenger`](https://github.com/elevenmessenger/messenger)
  (`docs/planet-scale-guide/`, the real source). Refresh it before deploying
  with that repo's `tools/sync-guide-to-website.sh <this-checkout>`, commit the
  change to `main`, then run `./deploy.sh`.
- Why local instead of an Actions workflow: the old `deploy.yml` (and the
  messenger repo's guide-sync workflow) are **disabled** — building locally
  removes the dependency on GitHub Actions entirely. `deploy.yml` is kept in the
  tree, disabled, as the record of the previous approach.
