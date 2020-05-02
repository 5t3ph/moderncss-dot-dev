const chromium = require("chrome-aws-lambda");
const fs = require("fs");
const path = require("path");

(async () => {
  console.log("Starting social images...");

  await chromium.font("https://fonts.gstatic.com/s/kanit/v5/nKKU-Go6G5tXcr4yPRWnVaFrNlJz.woff2");
  await chromium.font(
    "https://fonts.gstatic.com/s/baloo2/v1/wXKuE3kTposypRyd76v_Fe0KmF0xvdjqjw.woff2",
  );

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  // Load html from template
  const html = fs.readFileSync(path.resolve(__dirname, "./template.html")).toString();

  // Get generated post json
  const posts = require("./posts.json");

  // Render html
  await page.setContent(html, {
    waitUntil: ["domcontentloaded"],
  });

  // Wait until the document is fully rendered
  await page.evaluateHandle("document.fonts.ready");

  // Set the viewport to your preferred og:image size
  await page.setViewport({
    width: 600,
    height: 315,
    deviceScaleFactor: 2,
  });

  // Create an og-images directory in the public folder
  const dir = path.resolve(__dirname, "../public/img");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  // Go over all the posts
  for (const post of posts) {
    // Update the H1 element with the post title
    await page.evaluate((post) => {
      const title = document.querySelector("h1");
      title.innerHTML = post.title;

      const episode = document.querySelector(".episode");
      episode.innerHTML = post.episode;
    }, post);

    console.log(`Image: ${post.slug}.png`);

    // Save a screenshot to public/img/slug-of-post.jpeg
    await page.screenshot({
      path: `${dir}/${post.slug}.png`,
      type: "png",
      clip: { x: 0, y: 0, width: 600, height: 315 },
    });
  }

  await browser.close();
  console.log("Social images complete!");
})();
