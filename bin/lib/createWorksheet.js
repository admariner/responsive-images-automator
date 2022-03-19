import {
  CHOSEN_INTRINSIC_WIDTH,
  EVALUATION,
  RENDERED_FIDELITY,
  RENDERED_TO_IDEAL_FIDELITY_RATIO,
  WASTE,
  USAGE,
  PAGE_NAME,
} from "./constants.js";

function camelToSentence(camel) {
  const result = camel.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function getNumberFormat(key) {
  switch (key) {
    case USAGE:
    case WASTE:
      return "0.00%";
    case RENDERED_FIDELITY:
    case RENDERED_TO_IDEAL_FIDELITY_RATIO:
      return "0.00";
    default:
      return null;
  }
}

function getColumnKeys(thisPageData) {
  return [
    ...Object.keys(thisPageData[0]),
    RENDERED_FIDELITY,
    RENDERED_TO_IDEAL_FIDELITY_RATIO,
    EVALUATION,
    WASTE,
  ];
}

function getColumns(columnKeys) {
  return columnKeys.map((key) => ({
    key,
    header: key, //camelToSentence(key),
    style: {
      font: { bold: key === CHOSEN_INTRINSIC_WIDTH },
      numFmt: getNumberFormat(key),
    },
  }));
}

const autoWidth = (worksheet, minimalWidth = 1) => {
  worksheet.columns.forEach((column) => {
    let maxColumnLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      maxColumnLength = Math.max(
        maxColumnLength,
        minimalWidth,
        cell.value ? cell.value.toString().length : 0
      );
    });
    column.width = maxColumnLength + 1;
  });
};

function fillWithFormulas(worksheet, lastRowNumber, fidelityCap) {
  worksheet.fillFormula(`H2:H${lastRowNumber}`, "G2/D2");
  worksheet.fillFormula(`I2:I${lastRowNumber}`, `H2/MIN(${fidelityCap}, C2)`);
  worksheet.fillFormula(
    `J2:J${lastRowNumber}`,
    '_xlfn.IFS(I2<0.9, "POOR! (--)", I2<1, "(-)", I2=1, "OK", I2>1.2, "BIG (++)", I2>1, "(+)")'
  );
  worksheet.fillFormula(`K2:K${lastRowNumber}`, "(I2-1)*A2");
}

export default function (workbook, extractionRule, thisPageData, fidelityCap) {
  const worksheet = workbook.addWorksheet(extractionRule[PAGE_NAME]);
  const columnKeys = getColumnKeys(thisPageData);
  const lastRowNumber = thisPageData.length + 1;
  worksheet.columns = getColumns(columnKeys);
  worksheet.addRows(thisPageData);
  fillWithFormulas(worksheet, lastRowNumber, fidelityCap);
  autoWidth(worksheet);
}
