import { getImagesConfig } from "./readConfig.js";
import { CAP_TO_2X, IMAGE_TEMPLATE, PAGE_NAME } from "./constants.js";

const imagesConfig = await getImagesConfig();
export default function (pageName) {
  const thisImageRules = imagesConfig.find(
    (rule) => rule[PAGE_NAME] === pageName
  );
  if (!thisImageRules) {
    console.error(`Configuration for image at page "${pageName}" not found.`);
    return null;
  }
  const thisImageCap2xRule = thisImageRules[CAP_TO_2X];
  const isCapped = thisImageCap2xRule || thisImageCap2xRule === "true";
  const imageTemplate = thisImageRules[IMAGE_TEMPLATE];
  return { isCapped, imageTemplate };
}
