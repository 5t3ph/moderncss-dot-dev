const { DateTime } = require("luxon");

const sortByDate = (collection) => {
  return collection.getFilteredByTag("posts").sort((a, b) => {
    return b.data.episode - a.data.episode;
  });
};

const allTopics = (collection) => {
  return collection
    .getFilteredByTag("posts")
    .filter((post) => post.data.topics);
};

const popularPosts = (collection) => {
  return collection
    .getFilteredByTag("posts")
    .filter((post) => post.data.popular);
};

const upcomingOfficeHours = (collections) => {
  const allEvents = collections.getAll()[0].data.officeHours;

  return allEvents
    .filter((event) => {
      const date = DateTime.fromISO(event.datetime);
      return date.endOf("day") > DateTime.now();
    })
    .sort((a, b) => {
      const aDate = DateTime.fromISO(a.datetime);
      const bDate = DateTime.fromISO(b.datetime);
      return aDate - bDate;
    });
};

const socialContent = (collections) => {
  return collections.getAll().filter((i) => i.data.title);
};

module.exports = {
  sortByDate,
  allTopics,
  popularPosts,
  upcomingOfficeHours,
  socialContent,
};
