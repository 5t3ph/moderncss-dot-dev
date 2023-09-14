const { teaser } = require("./teaser");

const teaserPromo = () => teaser;

const year = () => `${new Date().getFullYear()}`;

const newsletterPromo = () => {
  return `<div class="promo promo--centered"><p><strong style="color: var(--color-blue);">Join my newsletter</strong> for article updates, CSS tips, and front-end resources!</p>
  <form name="newsletter" action="/success" class="form" method="POST" netlify-honeypot="bot-field" data-netlify="true">
    <p hidden>
      <label>Don’t fill this out if you're human: <input name="bot-field" /></label>
    </p>
    <div class="form-inline">
      <div class="form-group">
        <label for="email">Email</label>
        <input required type="text" id="email" name="email" class="form-field">
      </div>
      <button class="button" type="submit">Subscribe</button>
    </div>
  </form>
  </div>`;
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
          <cite>&mdash; <a href="${review.source}">${review.name}</a></cite>
        </footer>
      </blockquote>
    </li>`;
  }

  return "";
};

const icon = (icon, size = "24") => {
  return `<svg aria-hidden="true" focusable="false" width="${size}" height="${size}" fill="currentColor" class="button__icon"><use href="#icon-${icon}"></use></svg>`;
};

const codeDemo = (css, html, resize, placeCenter) => {
  if (!css) {
    return `
<div class="demo">
<div class="demo--content">
${html}
</div>
</div>`;
  }

  const hash = Math.floor(Math.random(100) * Math.floor(999));

  const cssRE = new RegExp(/(?<=(?<!\d)\.)([\w|-]+)(?=\s|,|:|\))/, "gm");
  const cssCode = css.replace(cssRE, `$1-${hash}`);
  const demoClass = resize == false ? " no-resize" : "";
  const contentClass = placeCenter ? " demo--place-center" : "";

  let htmlCode = html;
  css.match(cssRE).forEach((match) => {
    // prettier-ignore
    const htmlPattern = match.replace("-", "\\-");
    const htmlRE = new RegExp(`(${htmlPattern})(?=\\s|")`, "gm");
    htmlCode = htmlCode.replace(htmlRE, `${match}-${hash}`);
  });

  return `
<style>${cssCode}</style>
<div class="demo${demoClass}">
<div class="demo--content${contentClass}">
${htmlCode}
</div>
</div>`;
};

module.exports = {
  teaserPromo,
  year,
  newsletterPromo,
  carbonAd,
  peekaboo,
  codepen,
  link,
  twitter,
  review,
  icon,
  codeDemo,
};
