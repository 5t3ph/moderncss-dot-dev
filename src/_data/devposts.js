const axios = require("axios");

module.exports = async () => {
  const env = process.env.ELEVENTY_ENV;

  let data;

  if (env === "prod") {
    data = await axios.get("https://moderncss-dot-dev.netlify.app/.netlify/functions/devto");
  } else {
    data = require("./postdata.json");
  }

  return data;
};
