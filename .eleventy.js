const slugify = require("slugify");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/css");

  eleventyConfig.addFilter("slug", function (str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@\/]/g,
    });
  });

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
};
