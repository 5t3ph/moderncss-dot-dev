require("dotenv").config();
const { builder } = require("@netlify/functions");
const chromium = require("chrome-aws-lambda");

async function screenshot(slug, title, date) {
  // const baseURL = process.env.URL;
  const baseURL = "https://arch-redo--moderncss-dot-dev.netlify.app";
  const url = `${baseURL}/_social-template/`;
  let options = {
    type: "png",
    encoding: "base64",
  };
  let pageData = {
    slug,
    title: decodeURIComponent(title),
    date: decodeURIComponent(date),
  };

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: ["load", "networkidle0"],
    timeout: 3000,
  });

  await page.evaluateHandle("document.fonts.ready");

  await page.setViewport({
    width: 600,
    height: 315,
    deviceScaleFactor: 2,
  });

  await page.evaluate(({ slug, title, date }) => {
    const homeHero = document.querySelector(".hero--home");
    const postHero = document.querySelector(".hero:not(.hero--home)");
    const h1 = document.querySelector("h1");
    const dateEl = document.querySelector(".postdate");
    // const byline = document.querySelector(".byline");
    const isHome = slug === "home";

    if (isHome) {
      homeHero.removeAttribute("hidden");
      postHero.remove();
    } else {
      if (h1) {
        h1.innerHTML = title;
      }

      if (dateEl) {
        dateEl.innerHTML = `Posted on: ${date}`;
      } else {
        dateEl.remove();
      }
    }
  }, pageData);

  let output = await page.screenshot(options);

  await browser.close();

  return output;
}

async function handler(event, _context) {
  let pathSplit = event.path.split("/").filter((entry) => !!entry);
  let [_base, slug, title, date] = pathSplit;

  try {
    let output = await screenshot(slug, title, date);

    return {
      statusCode: 200,
      headers: {
        "content-type": `image/png`,
      },
      body: output,
      isBase64Encoded: true,
    };
  } catch (error) {
    console.log("Error", error);

    return {
      statusCode: 200,
      headers: {
        "content-type": "image/svg+xml",
      },
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="#b1eae5"><rect width="400" height="300" /></svg>`,
      isBase64Encoded: false,
    };
  }
}

exports.handler = builder(handler);
