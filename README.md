# 🤖 Eleven Messenger — website

The marketing site for [Eleven Messenger](https://elevenmessenger.com), built
with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

## Develop

```sh
npm install
npm run serve   # local preview with live reload
npm run build   # build to ./_site
```

- Pages live in `src/` (`index.njk`, `privacy.njk`), sharing `src/_includes/base.njk`.
- Styles are `src/styles.css`; `src/CNAME` pins the custom domain.

## Deploy

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages at **elevenmessenger.com**.
