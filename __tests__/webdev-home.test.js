const pageName = "webdev-home";
const puppeteer = require("puppeteer");
const pageUrl = `http://localhost:8080/page/${pageName}`;
let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    //headless: false
  });
});

describe(`Testing ${pageName} page image`, () => {
  test.each`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${375}        | ${3}       | ${692}
    ${414}        | ${2}       | ${692}
    ${390}        | ${3}       | ${692}
    ${375}        | ${2}       | ${692}
    ${414}        | ${3}       | ${692}
    ${360}        | ${3}       | ${692}
    ${428}        | ${3}       | ${692}
    ${1920}       | ${1}       | ${558}
    ${412}        | ${2.63}    | ${692}
    ${1440}       | ${2}       | ${1116}
    ${1366}       | ${1}       | ${558}
    ${360}        | ${2}       | ${692}
    ${768}        | ${2}       | ${558}
    ${393}        | ${2.75}    | ${692}
    ${1536}       | ${1.25}    | ${692}
    ${320}        | ${2}       | ${558}
  `(
    `When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth`,
    async ({ viewportWidth, pixelRatio, expectedIntrinsicWidth }) => {
      const page = await browser.newPage();
      await page.setCacheEnabled(false);
      await page.setViewport({
        deviceScaleFactor: pixelRatio,
        width: viewportWidth,
        height: 667,
      });
      await page.goto(pageUrl);
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(`document.querySelector("img").currentSrc`);
      //await page.screenshot({ path: `detail-${viewportWidth}@${pixelRatio}.png` });
      const body = await page.$("body");
      expect(await body.$eval("img", (img) => img.currentSrc)).toBe(
        `https://via.placeholder.com/${expectedIntrinsicWidth}`
      );
    }
  );
});

afterAll(async () => {
  await browser.close();
});
