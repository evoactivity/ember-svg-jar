'use strict';
const {
  generateComponentName
} = require('./utils');

module.exports = {
  symbolIdGen: (svgPath, { prefix }) => `${prefix}${svgPath}`.replace(/[\s]/g, '-'),
  symbolCopypastaGen: (assetId) => `{{svg-jar "#${assetId}"}}`,
  inlineIdGen: (svgPath) => svgPath,
  inlineCopypastaGen: (assetId) => `{{svg-jar "${assetId}"}}`,
  hbsIdGen: (svgPath, { prefix }) => `${prefix}${generateComponentName(svgPath).dashCase}`,
  hbsCopypastaGen: (assetId) => {
    const name = generateComponentName(assetId).pascalCase;
    return `<${name} />`
  }
};
