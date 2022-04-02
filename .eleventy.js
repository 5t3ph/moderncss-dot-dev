const collections = require("./src/_11ty/collections");
const filters = require("./src/_11ty/filters");
const shortcodes = require("./src/_11ty/shortcodes");

const Terser = require("terser");
const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const openInCodepen = require("@11tyrocks/eleventy-plugin-open-in-codepen");
const socialImages = require("@11tyrocks/eleventy-plugin-social-images");
const pluginTOC = require("eleventy-plugin-toc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginTOC, { tags: ["h2"] });
  eleventyConfig.addPlugin(socialImages);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(openInCodepen, {
    siteUrl: "ModernCSS.dev",
    siteTitle: "Modern CSS Solutions",
    siteTag: "moderncss",
    buttonClass: "button",
    buttonIconClass: "button__icon",
  });

  eleventyConfig.addWatchTarget("./src/sass/");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.png");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/_redirects");
  eleventyConfig.addPassthroughCopy("./_headers");

  // Collections: /src/_11ty/collections.js
  Object.keys(collections).forEach((collectionName) => {
    eleventyConfig.addCollection(collectionName, collections[collectionName]);
  });

  // Filters: /src/_11ty/filters.js
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  eleventyConfig.addNunjucksAsyncFilter("jsmin", async (code, callback) => {
    try {
      const minified = await Terser.minify(code);
      return callback(null, minified.code);
    } catch (err) {
      console.error("Error during terser minify:", err);
      return callback(err, code);
    }
  });

  // Shortcodes: /src/config/shortcodes.js
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
  });

  // https://11ty.rocks/eleventyjs/slugs-anchors/#enable-anchor-links-on-content-headings
  const linkAfterHeader = markdownItAnchor.permalink.linkAfterHeader({
    class: "anchor",
    symbol: "<span hidden>#</span>",
    style: "aria-labelledby",
  });
  const markdownItAnchorOptions = {
    level: [1, 2, 3],
    slugify: (str) =>
      slugify(str, {
        lower: true,
        strict: true,
        remove: /["]/g,
      }),
    tabIndex: false,
    permalink(slug, opts, state, idx) {
      state.tokens.splice(
        idx,
        0,
        Object.assign(new state.Token("div_open", "div", 1), {
          // Add class "header-wrapper [h1 or h2 or h3]"
          attrs: [["class", `heading-wrapper ${state.tokens[idx].tag}`]],
          block: true,
        })
      );

      state.tokens.splice(
        idx + 4,
        0,
        Object.assign(new state.Token("div_close", "div", -1), {
          block: true,
        })
      );

      linkAfterHeader(slug, opts, state, idx + 1);
    },
  };

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
  }).use(markdownItAnchor, markdownItAnchorOptions);
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
};
