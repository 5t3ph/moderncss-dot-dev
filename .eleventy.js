const Terser = require("terser");
const emojiRegex = require("emoji-regex");
const { DateTime } = require("luxon");

const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addPassthroughCopy("*.css");
  eleventyConfig.addPassthroughCopy("./src/favicon.png");

  eleventyConfig.addFilter("slug", (str) => {
    const regex = emojiRegex();
    // Remove Emoji first
    let string = str.replace(regex, "");

    return slugify(string, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@\/]/g,
    });
  });

  eleventyConfig.addFilter("jsmin", function (code) {
    let minified = Terser.minify(code);
    if (minified.error) {
      console.log("Terser error: ", minified.error);
      return code;
    }

    return minified.code;
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
