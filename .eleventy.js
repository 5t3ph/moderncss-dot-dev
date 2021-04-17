const Terser = require("terser");
const { DateTime } = require("luxon");
const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const upcoming = require("./src/_data/upcoming");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const { reset } = require("./src/_includes/postToCodepen");

const teaser = `<blockquote class="promo"><p><em>Hey there!</em> Register for my CSS workshop in July with Smashing Conference: <a href="https://smashingconf.com/online-workshops/workshops/stephanie-eckles">Level-Up With Modern&nbsp;CSS</a></p></blockquote>`;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.png");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/_redirects");

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

  eleventyConfig.addFilter("slug", (str) => {
    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });

  eleventyConfig.addFilter("topic", function (arr, topic) {
    return arr.filter((item) => {
      return item.data.topics && item.data.topics.includes(topic);
    });
  });

  eleventyConfig.addShortcode("codeDemo", function (css, html, resize, placeCenter) {
    if (!css) {
      return `
<div class="tdbc-demo">
<div class="tdbc-demo--content">
${html}
</div>
</div>`;
    }

    const hash = Math.floor(Math.random(100) * Math.floor(999));

    const cssRE = new RegExp(/(?<=\.)([\w|-]+)(?=\s|,|:)/, "gm");
    const cssCode = css.replace(cssRE, `$1-${hash}`);
    const demoClass = resize == false ? " no-resize" : "";
    const contentClass = placeCenter ? " tdbc-demo--place-center" : "";

    let htmlCode = html;
    css.match(cssRE).forEach((match) => {
      // prettier-ignore
      const htmlPattern = match.replace("-", "\\-");
      const htmlRE = new RegExp(`(${htmlPattern})(?=\\s|")`, "gm");
      htmlCode = htmlCode.replace(htmlRE, `${match}-${hash}`);
    });

    return `
<style>${cssCode}</style>
<div class="tdbc-demo${demoClass}">
<div class="tdbc-demo--content${contentClass}">
${htmlCode}
</div>
</div>`;
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

    return `${pre}${teaser}${post}`;
  });

  eleventyConfig.addShortcode("teaser", () => {
    return teaser;
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

  eleventyConfig.addShortcode("postToCodepen", (title, slug, css, html) => {
    const description = `Generated from: https://ModernCSS.dev${slug}`;
    const snippetComment = `/***\n 🟣 ModernCSS Demo Styles\n */`;
    const baseCSS = `\n${css}`;
    let cssCode = `${reset}\n\n${snippetComment}${baseCSS}`;

    const penAttributes = {
      title: `ModernCSS - ${title}`,
      description: description,
      tags: ["moderncss"],
      editors: "110",
      layout: "left",
      html: `<!-- ModernCSS - ${title}\n${description} -->${html}`,
      html_pre_processor: "none",
      css: cssCode,
      css_pre_processor: "scss",
      css_starter: "neither",
      css_prefix: "autoprefixer",
      head: "<meta name='viewport' content='width=device-width, initial-scale=1'>",
    };
    const JSONstring = JSON.stringify(penAttributes)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    return `<form action="https://codepen.io/pen/define" method="POST" target="_blank">
        <input type="hidden" name="data" value="${JSONstring}">
        <button class="tdbc-button" type="submit" data-name="${title}" aria-label="Open ${title} in CodePen"><span class="tdbc-button__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M32 10.909l-0.024-0.116-0.023-0.067c-0.013-0.032-0.024-0.067-0.040-0.1-0.004-0.024-0.020-0.045-0.027-0.067l-0.047-0.089-0.040-0.067-0.059-0.080-0.061-0.060-0.080-0.060-0.061-0.040-0.080-0.059-0.059-0.053-0.020-0.027-14.607-9.772c-0.463-0.309-1.061-0.309-1.523 0l-14.805 9.883-0.051 0.053-0.067 0.075-0.049 0.060-0.067 0.080c-0.027 0.023-0.040 0.040-0.040 0.061l-0.067 0.080-0.027 0.080c-0.027 0.013-0.027 0.053-0.040 0.093l-0.013 0.067c-0.025 0.041-0.025 0.081-0.025 0.121v9.996c0 0.059 0.004 0.12 0.013 0.18l0.013 0.061c0.007 0.040 0.013 0.080 0.027 0.115l0.020 0.067c0.013 0.036 0.021 0.071 0.036 0.1l0.029 0.067c0 0.013 0.020 0.053 0.040 0.080l0.040 0.053c0.020 0.013 0.040 0.053 0.060 0.080l0.040 0.053 0.053 0.053c0.013 0.017 0.013 0.040 0.040 0.040l0.080 0.056 0.053 0.040 0.013 0.019 14.627 9.773c0.219 0.16 0.5 0.217 0.76 0.217s0.52-0.080 0.76-0.24l14.877-9.875 0.069-0.077 0.044-0.060 0.053-0.080 0.040-0.067 0.040-0.093 0.021-0.069 0.040-0.103 0.020-0.060 0.040-0.107v-10c0-0.067 0-0.127-0.021-0.187l-0.019-0.060 0.059 0.004zM16.013 19.283l-4.867-3.253 4.867-3.256 4.867 3.253-4.867 3.253zM14.635 10.384l-5.964 3.987-4.817-3.221 10.781-7.187v6.424zM6.195 16.028l-3.443 2.307v-4.601l3.443 2.301zM8.671 17.695l5.964 3.987v6.427l-10.781-7.188 4.824-3.223v-0.005zM17.387 21.681l5.965-3.973 4.817 3.227-10.783 7.187v-6.427zM25.827 16.041l3.444-2.293v4.608l-3.444-2.307zM23.353 14.388l-5.964-3.988v-6.44l10.78 7.187-4.816 3.224z"></path>
    </svg></span> Open in CodePen</button>
        </form>`;
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
