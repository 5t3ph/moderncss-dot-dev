const slugify = require("slugify");
const { DateTime } = require("luxon");

const slug = (str) => {
  return slugify(str, {
    lower: true,
    strict: true,
    remove: /["]/g,
  });
};

const postDate = (dateObj) => {
  return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
};

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
const htmlDateString = (dateObj) => {
  return DateTime.fromISO(dateObj, {
    zone: "UTC",
  }).toFormat("yyyy-LL-dd");
};

const topic = (arr, topic) => {
  return arr.filter((item) => {
    return item.data.topics && item.data.topics.includes(topic);
  });
};

const jsonTitle = (str) => {
  if (!str) return;

  let title = str.replace(/((.*)\s(.*)\s(.*))$/g, "$2&nbsp;$3&nbsp;$4");
  title = title.replace(/"(.*)"/g, '\\"$1\\"');
  return title;
};

const encodeTweet = (str) => {
  return `${encodeURIComponent(str)}%0D${encodeURIComponent(
    "Shared from ModernCSS.dev | By @5t3ph"
  )}%0D%0D`;
};

const randomLimit = (arr, limit, currPage) => {
  const pageArr = arr.filter((page) => page.url !== currPage);
  pageArr.sort(() => {
    return 0.5 - Math.random();
  });
  return pageArr.slice(0, limit);
};

const teaser = `<blockquote class="promo"><p><em>Hey there!</em> You may also enjoy my end-of-year project celebrating web fundamentals: <a href="https://12daysofweb.dev"><strong>12DaysOfWeb.dev</strong></a></p></blockquote>`;

const addTeaser = (content) => {
  const position = content.lastIndexOf("</p>", 5200);
  const pre = content.slice(0, position);
  const post = content.substring(position, content.length);

  return `${pre}${teaser}${post}`;
};

module.exports = {
  slug,
  postDate,
  htmlDateString,
  topic,
  jsonTitle,
  encodeTweet,
  randomLimit,
  addTeaser,
};
