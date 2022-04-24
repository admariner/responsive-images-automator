const getTestCasesRows = (testCases) =>
  testCases
    .map(
      ({ viewportWidth, pixelRatio, chosenIntrinsicWidth }) =>
        `\${${viewportWidth}} | \${${pixelRatio}} | \${${chosenIntrinsicWidth}}`
    )
    .join("\n");

export default (imageName, testCases) => `
const testFnFactory = require("./factory/testFnFactory");

const imageName = "${imageName}";
const pageUrl = \`http://localhost:8080/image/\${imageName}\`;

describe(\`Testing \${imageName} image at "\${pageUrl}" \`, () => {
  test.each\`
    viewportWidth | pixelRatio | expectedIntrinsicWidth
    ${getTestCasesRows(testCases)}\`(
    \`When viewport is $viewportWidth @ $pixelRatio, image intrinsic width should be $expectedIntrinsicWidth\`,
    testFnFactory(pageUrl)
  );
});
`;
