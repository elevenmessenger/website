module.exports = function (eleventyConfig) {
  // Static assets copied straight through to the site root.
  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/demo.css": "demo.css" });
  eleventyConfig.addPassthroughCopy({ "src/ambient.js": "ambient.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // CNAME tells GitHub Pages which custom domain to serve (elevenmessenger.com).
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  // The planet-scale operations guide — mirrored from elevenmessenger/messenger
  // (docs/planet-scale-guide/, the actual source) with that repo's
  // tools/sync-guide-to-website.sh, then published by ./deploy.sh. Never edited
  // here directly; passthrough because it is already plain static HTML/CSS/JS,
  // not a template. (The old auto-sync Action is disabled — see README § Deploy.)
  eleventyConfig.addPassthroughCopy({ "src/infrastructure": "infrastructure" });

  return {
    dir: { input: "src", includes: "_includes", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
