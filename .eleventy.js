module.exports = function (eleventyConfig) {
  // Static assets copied straight through to the site root.
  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/demo.css": "demo.css" });
  eleventyConfig.addPassthroughCopy({ "src/ambient.js": "ambient.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // CNAME tells GitHub Pages which custom domain to serve (elevenmessenger.com).
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  return {
    dir: { input: "src", includes: "_includes", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
