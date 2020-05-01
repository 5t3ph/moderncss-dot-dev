const { DateTime } = require("luxon");

const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("./src/css");

  eleventyConfig.addFilter("slug", (str) => {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@\/]/g,
    });
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addShortcode("peekaboo", (index) => {
    const randomIndex = Math.floor(Math.random() * 5);
    if (randomIndex === index) {
      return "tdbc-peekaboo";
    }
    return "";
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromISO(dateObj, { zone: "America/Chicago" }).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addFilter("randomLimit", (arr, limit, currPage) => {
    const pageArr = arr.filter((page) => page.url !== currPage);
    pageArr.sort(() => {
      return 0.5 - Math.random();
    });
    return pageArr.slice(0, limit);
  });

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
};
