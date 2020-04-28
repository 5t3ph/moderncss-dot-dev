const axios = require("axios");

module.exports = async () => {
  const apiPosts = await axios.get(
    "https://moderncss-dot-dev.netlify.app/.netlify/functions/devto",
  );

  return apiPosts.data;
};
