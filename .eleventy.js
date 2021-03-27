const Terser = require("terser");
const { DateTime } = require("luxon");
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
      return b.data.episode - a.data.episode;
    });
  });

  eleventyConfig.addCollection("allTopics", function (collection) {
    return collection.getFilteredByTag("posts").filter((post) => post.data.topics);
  });

  eleventyConfig.addFilter("topic", function (arr, topic) {
    return arr.filter((item) => {
      return item.data.topics && item.data.topics.includes(topic);
    });
  });

  eleventyConfig.addFilter("jsonTitle", (str) => {
    if (!str) return;

    let title = str.replace(/((.*)\s(.*)\s(.*))$/g, "$2&nbsp;$3&nbsp;$4");
    title = title.replace(/"(.*)"/g, '\\"$1\\"');
    return title;
  });

  eleventyConfig.addFilter("addTeaser", (content) => {
    const position = content.lastIndexOf("</p>", 5200);
    const pre = content.slice(0, position);
    const post = content.substring(position, content.length);
    const teaser = `<blockquote class="promo"><p><em>Hey there!</em> Early bird registration is available for my upcoming July workshop with Smashing Conference - <a href="https://smashingconf.com/online-workshops/workshops/stephanie-eckles">Level-Up With Modern CSS</a></p></blockquote>`;

    return `${pre}${teaser}${post}`;
  });

  eleventyConfig.addShortcode("newsletterPromo", () => {
    return `<blockquote class="promo"><p><strong>Would you like CSS tips in your inbox?</strong> <a href="/newsletter/">Join my newsletter</a> for article updates, CSS tips, and front-end resources!</p></blockquote>`;
  });

  eleventyConfig.addShortcode("carbonAd", () => {
    return `<div class="tdbc-card tdbc-card--teaser tdbc-card--ad">
	<div class="tdbc-card__content">
		<script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?serve=CE7I52QE&placement=moderncssdev" id="_carbonads_js"></script>
	</div>
</div>`;
  });

  eleventyConfig.addShortcode("codepen", (penID) => {
    return `<p class="codepen" data-height="265" data-theme-id="default" data-default-tab="result" data-user="5t3ph" data-slug-hash="${penID}" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;"><span>By Stephanie Eckles (<a href="https://codepen.io/5t3ph">@5t3ph</a>)</span></p>`;
  });

  eleventyConfig.addShortcode("link", (link) => {
    return `<a href="${link}" class="tdbc-button tdbc-button--small">View post</a>`;
  });

  eleventyConfig.addShortcode("twitter", (tweetID) => {
    return `<a href="https://twitter.com/5t3ph/status/${tweetID}" class="tdbc-button tdbc-button--small">View tweet</a>`;
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
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromISO(dateObj, {
      zone: "UTC",
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
