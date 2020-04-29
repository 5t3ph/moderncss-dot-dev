const slugify = require("slugify");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/css");

  eleventyConfig.addFilter("slug", function (str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@\/]/g,
    });
  });

  eleventyConfig.addFilter("markdownify", (str) => {
    return md.render(str);
  });

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
};
