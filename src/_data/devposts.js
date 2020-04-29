const axios = require("axios");
require("dotenv").config();

const apiRoot = "https://dev.to/api/articles/me/published?per_page=100";

module.exports = async () => {
  const { data } = await axios.get(apiRoot, { headers: { "api-key": process.env.DEVTO } });

  let response = [];
  const seriesText = "modern CSS";

  // Grab the items and re-format to the fields we want
  if (data.length) {
    const series = data.filter((item) => item.description.includes(seriesText));

    response = series.map((item) => ({
      title: item.title,
      url: item.url,
      description: item.description,
      tags: item.tag_list.join(", "),
      body: item.body_markdown,
      date: item.published_at,
    }));
  }
  return response;
};
