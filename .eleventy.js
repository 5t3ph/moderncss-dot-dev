const Terser = require("terser");
const emojiRegex = require("emoji-regex");
const { DateTime } = require("luxon");
const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const upcoming = require("./src/_data/upcoming");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.png");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");

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

  eleventyConfig.addNunjucksAsyncFilter("jsmin", async (code, callback) => {
    try {
      const minified = await Terser.minify(code);
      return callback(null, minified.code);
    } catch (err) {
      console.error("Error during terser minify:", err);
      return callback(err, code);
    }
  });

  eleventyConfig.addCollection("sortByDate", function (collection) {
    return collection.getFilteredByTag("posts").sort((a, b) => {
      return b.data.post.episode - a.data.post.episode;
    });
  });

  eleventyConfig.addCollection("allTopics", function (collection) {
    const allTopics = collection.getFilteredByTag("posts").filter((post) => {
      const postTopics = post.data.post.topics;

      return postTopics;
    });

    return allTopics;
  });

  eleventyConfig.addFilter("topic", function (arr, topic) {
    return arr.filter((item) => {
      return item.data.post.topics && item.data.post.topics.includes(topic);
    });
  });

  eleventyConfig.addFilter("jsonTitle", (str) => {
    let title = str.replace(/((.*)\s(.*)\s(.*))$/g, "$2&nbsp;$3&nbsp;$4");
    title = title.replace(/"(.*)"/g, '\\"$1\\"');
    return title;
  });

  eleventyConfig.addFilter("addTeaser", (content) => {
    const position = content.lastIndexOf("</p>", 5200);
    const pre = content.slice(0, position);
    const post = content.substring(position, content.length);
    const teaser = `<blockquote class="promo"><p><em>Hey there!</em> Early bird registration is available for my upcoming July workshop with Smashing Conference - <a href="">Level-Up With Modern CSS</a></p></blockquote>`;

    return `${pre}${teaser}${post}`;
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addShortcode("peekaboo", (index) => {
    const randomIndex = Math.floor(Math.random() * 5);
    if (randomIndex === index) {
      return "tdbc-peekaboo";
    }
    return "";
  });

  eleventyConfig.addShortcode("upcomingTopic", (index) => {
    const nextIndex = index + 1;
    const nextTopic = upcoming[nextIndex];

    if (nextTopic !== undefined) {
      return `<li class="tdbc-card tdbc-card--teaser">
          <div class="tdbc-card__content tdbc-text-align-center">
            <span class="tdbc-lead tdbc-my-auto">Upcoming Topic: <br/><span class="tdbc-h3 tdbc-ink--secondary">${nextTopic}</span></span>
          </div>
        </li>`;
    }

    return "";
  });

  eleventyConfig.addShortcode("review", (index) => {
    let review = index !== "random" && reviews[index];

    if (index === "random") {
      const randomIndex = Math.floor(Math.random() * reviews.length);
      review = reviews[randomIndex];
    }

    if (review !== undefined) {
      return `<li class="tdbc-card tdbc-card--text">
          <blockquote class="tdbc-card__content tdbc-text-align-center">
            <img src="/img/avatars/${review.avatar}.jpg" alt="${review.name}" />
            <p class="tdbc-ink--secondary">${review.quote}</p>
            <footer>
              <cite class"tdbc-ink--gray">&mdash; <a href="${review.source}">${review.name}</a></cite>
            </footer>
          </blockquote>
        </li>`;
    }

    return "";
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromISO(dateObj, {
      zone: "America/Chicago",
    }).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addFilter("postRssDate", (dateObj) => {
    return DateTime.fromISO(dateObj).toISO({
      includeOffset: true,
      suppressMilliseconds: true,
    });
  });

  eleventyConfig.addNunjucksFilter("rssLastUpdatedDate", (collection) => {
    if (!collection || !collection.length) {
      throw new Error("Collection is empty in rssLastUpdatedDate filter.");
    }

    // Newest date in the collection
    return DateTime.fromISO(collection[0].data.post.date).toISO({
      includeOffset: true,
      suppressMilliseconds: true,
    });
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromISO(dateObj, {
      zone: "utc",
    }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("encodeTweet", (str) => {
    return `${encodeURIComponent(str)}%0D${encodeURIComponent(
      "Shared from ModernCSS.dev | By @5t3ph",
    )}%0D%0D`;
  });

  eleventyConfig.addFilter("randomLimit", (arr, limit, currPage) => {
    const pageArr = arr.filter((page) => page.url !== currPage);
    pageArr.sort(() => {
      return 0.5 - Math.random();
    });
    return pageArr.slice(0, limit);
  });

  eleventyConfig.addFilter("stripFilename", (file) => {
    return file.replace(/\.[^/.]+$/, "");
  });

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "tdbc-anchor",
    permalinkSymbol: "#",
    permalinkSpace: false,
    level: [1, 2, 3],
    slugify: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[\s+~\/]/g, "-")
        .replace(/[().`,%·'"!?¿:@*]/g, ""),
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
};
