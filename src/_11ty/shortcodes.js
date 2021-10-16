const upcoming = require("../_data/upcoming");

const year = () => `${new Date().getFullYear()}`;

const newsletterPromo = () => {
  return `<blockquote class="promo"><p><strong>Would you like CSS tips in your inbox?</strong> <a href="/newsletter/">Join my newsletter</a> for article updates, CSS tips, and front-end resources!</p></blockquote>`;
};

const carbonAd = () => {
  return `<div class="carbon-ad">
		<script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?serve=CE7I52QE&placement=moderncssdev" id="_carbonads_js"></script>
	</div>`;
};

const peekaboo = (index) => {
  const randomIndex = Math.floor(Math.random() * 5);
  if (randomIndex === index) {
    return "peekaboo";
  }
  return "";
};

const codepen = (penID) => {
  return `<p class="codepen" data-height="265" data-theme-id="default" data-default-tab="result" data-user="5t3ph" data-slug-hash="${penID}" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;"><span>By Stephanie Eckles (<a href="https://codepen.io/5t3ph">@5t3ph</a>)</span></p>`;
};

const link = (link) => {
  return `<a href="${link}" class="button button--small">View post</a>`;
};

const twitter = (tweetID) => {
  return `<a href="https://twitter.com/5t3ph/status/${tweetID}" class="button button--small">View tweet</a>`;
};

const upcomingTopic = (index) => {
  const nextIndex = index + 1;
  const nextTopic = upcoming[nextIndex];

  if (nextTopic !== undefined) {
    return `<li class="card card--teaser">
      <div class="card__content text-align-center">
        <span class="lead">Upcoming Topic: <br/><span class="color-secondary">${nextTopic}</span></span>
      </div>
    </li>`;
  }

  return "";
};

const review = (index) => {
  let review = index !== "random" && reviews[index];

  if (index === "random") {
    const randomIndex = Math.floor(Math.random() * reviews.length);
    review = reviews[randomIndex];
  }

  if (review !== undefined) {
    return `<li class="card card--text">
      <blockquote class="card__content text-align-center">
        <img src="/img/avatars/${review.avatar}.jpg" alt="${review.name}" />
        <p class="color-secondary">${review.quote}</p>
        <footer>
          <cite class"color-gray">&mdash; <a href="${review.source}">${review.name}</a></cite>
        </footer>
      </blockquote>
    </li>`;
  }

  return "";
};

const icon = (icon, size = "24") => {
  return `<svg aria-hidden="true" focusable="false" width="${size}" height="${size}" fill="currentColor" class="button__icon"><use href="#icon-${icon}"></use></svg>`;
};

module.exports = {
  year,
  newsletterPromo,
  carbonAd,
  peekaboo,
  codepen,
  link,
  twitter,
  upcomingTopic,
  review,
  icon,
};
