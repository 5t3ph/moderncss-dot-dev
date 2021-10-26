require("dotenv").config();
const { builder } = require("@netlify/functions");
const chromium = require("chrome-aws-lambda");

async function screenshot(templateType, title, meta) {
  const baseURL = process.env.URL;
  const url = `${baseURL}/_social-template/`;
  let options = {
    type: "jpeg",
    encoding: "base64",
    quality: 80,
  };
  let pageData = {
    templateType,
    title: decodeURIComponent(title),
    meta: decodeURIComponent(meta),
  };

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: ["domcontentloaded"],
    timeout: 3000,
  });

  await page.evaluateHandle("document.fonts.ready");

  await page.setViewport({
    width: 600,
    height: 315,
    deviceScaleFactor: 2,
  });

  await page.evaluate(({ templateType, title, meta }) => {
    const homeHero = document.querySelector(".hero--home");
    const postHero = document.querySelector(".hero:not(.hero--home)");
    const h1 = document.querySelector("h1");
    const postMeta = document.querySelector(".postmeta");
    const isHome = templateType === "home";

    if (isHome) {
      homeHero.removeAttribute("hidden");
      postHero.remove();
    } else {
      if (h1) {
        let postTitle = title.replace(
          /((.*)\s(.*)\s(.*))$/g,
          "$2&nbsp;$3&nbsp;$4"
        );
        postTitle = postTitle.replace(/"(.*)"/g, '\\"$1\\"');
        h1.innerHTML = postTitle;
      }

      if (postMeta) {
        if (templateType == "post") {
          postMeta.innerHTML = `Posted on: ${meta}`;
        } else if (templateType == "page") {
          postMeta.innerHTML = meta;
        } else {
          postMeta.remove();
        }
      }
    }
  }, pageData);

  let output = await page.screenshot(options);

  await browser.close();

  return output;
}

async function handler(event, _context) {
  let pathSplit = event.path.split("/").filter((entry) => !!entry);
  let [_base, templateType, title, meta] = pathSplit;

  try {
    let output = await screenshot(templateType, title, meta);

    return {
      statusCode: 200,
      headers: {
        "content-type": `image/jpeg`,
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
