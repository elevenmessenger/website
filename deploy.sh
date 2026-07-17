#!/usr/bin/env bash
# 🤖 Build the marketing site locally and publish it to the gh-pages branch,
# which GitHub Pages serves directly (branch-deploy — NO GitHub Actions). Run
# from anywhere inside the repo.
#
# The planet-scale guide under src/infrastructure/ is mirrored from
# elevenmessenger/messenger (docs/planet-scale-guide/, the real source). Refresh
# it before deploying with that repo's tools/sync-guide-to-website.sh <checkout>
# and commit the change to main; it is plain static files, committed here as-is.
set -euo pipefail
cd "$(dirname "$0")"

npm ci
npx @11ty/eleventy                 # -> _site (CNAME + src/infrastructure passthrough)
touch _site/.nojekyll              # publish as-is; skip GitHub's Jekyll pass

# Publish the built _site as the whole tree of an orphan gh-pages branch. Built
# in a throwaway repo so the source checkout is never disturbed, then force-
# pushed (gh-pages is derived output, not history worth keeping).
tmp="$(mktemp -d)"
cp -R _site/. "$tmp/"
git -C "$tmp" init -q
git -C "$tmp" checkout -q -b gh-pages
git -C "$tmp" add -A
git -C "$tmp" -c user.email="$(git config user.email)" \
              -c user.name="$(git config user.name)" \
              commit -q -m "Deploy site: local Eleventy build"
git -C "$tmp" push -f "$(git remote get-url origin)" gh-pages
rm -rf "$tmp"

echo "Published _site to gh-pages — live at https://elevenmessenger.com/ within ~1 minute."
