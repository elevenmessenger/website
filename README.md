# Eleven Messenger — website

The marketing site for [Eleven Messenger](https://elevenmessenger.com), built
with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

## Develop

```sh
npm install
npm run serve   # local preview with live reload
npm run build   # build to ./_site
```

- Pages live in `src/` (home, features, story, openness, planet, nerds,
  security, privacy, why-eleven), sharing `src/_includes/base.njk`.
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

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages at **elevenmessenger.com**.
