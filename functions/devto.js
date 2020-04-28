const axios = require("axios");

const apiRoot = "https://dev.to/api/articles/me/published?per_page=9";

exports.handler = async (event, context, callback) => {
  try {
    const { data } = await axios.get(apiRoot, { headers: { "api-key": process.env.DEVTO } });

    let response = [];

    // Grab the items and re-format to the fields we want
    if (data.length) {
      response = data.map((item) => ({
        title: item.title,
        url: item.url,
        description: item.description,
        tags: item.tag_list.join(", "),
      }));
    }
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(response),
    });
  } catch (err) {
    callback(err);
  }
};
