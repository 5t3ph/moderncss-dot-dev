const axios = require("axios");

const apiRoot = "https://dev.to/api/articles/me/published?per_page=100";

exports.handler = async (event, context, callback) => {
  try {
    const { data } = await axios.get(apiRoot, { headers: { "api-key": process.env.DEVTO } });

    let response = [];
    const seriesText = "modern CSS";

    // Grab the items and re-format to the fields we want
    if (data.length) {
      response = data.map((item) => {
        if (item.description.contains(seriesText)) {
          return {
            title: item.title,
            url: item.url,
            description: item.description,
            tags: item.tag_list.join(", "),
            body: item.body_markdown,
            date: item.published_at,
          };
        }
      });
    }
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(response),
    });
  } catch (err) {
    callback(err);
  }
};
