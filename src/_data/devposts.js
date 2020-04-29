const axios = require("axios");
require("dotenv").config();

const apiRoot = "https://dev.to/api/articles/me/published?per_page=100";

const parseDevMd = (md) => {
  const regex = /{% (\w+) (.*) %}/g;

  let content = md;

  if ((m = regex.exec(md)) !== null) {
    const type = m[1];
    let result;

    if (type === "codepen") {
      const cpLink = /https:\/\/codepen\.io\/5t3ph\/pen\/(\w+)/;
      let cpM;

      if ((cpM = cpLink.exec(m[2])) !== null) {
        const hash = cpM[1];
        result = `<p class="codepen" data-height="265" data-theme-id="default" data-default-tab="result" data-user="5t3ph" data-slug-hash="${hash}" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="CSS-Only Dropdown Navigation Menu">
  <span>By Stephanie Eckles (<a href="https://codepen.io/5t3ph">@5t3ph</a>)</span>
</p>`;
      }
    }

    if (type === "link") {
      result = `<a href="${m[2]}" class="tdbc-button tdbc-button--small">View post</a>`;
    }

    content = md.replace(m[0], result);
  }

  // return md.replace(regex, '{% $1 "$2" %}');
  return content;
};

module.exports = async () => {
  const { data } = await axios.get(apiRoot, { headers: { "api-key": process.env.DEVTO } });

  let response = [];
  const seriesText = "modern CSS";

  // Grab the items and re-format to the fields we want
  if (data.length) {
    const series = data.filter((item) => item.description.includes(seriesText));

    response = series.map((item, index) => ({
      title: item.title,
      url: item.url,
      body: parseDevMd(item.body_markdown),
      date: item.published_at,
      episode: index,
      description: item.description,
    }));
  }
  return response;
};
