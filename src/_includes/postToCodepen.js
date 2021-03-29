module.exports = {
  reset: `
/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p {
  margin: 0;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
  font-family: system-ui, sans-serif;
}

/* Make images easier to work with */
img {
  display: block;
  max-width: 100%;
}`,
};
