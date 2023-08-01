import { helper } from '@ember/component/helper';
import makeSVG from 'ember-svg-jar/utils/make-svg';

function getInlineAsset(assetId) {
  let result = null;
  try {
    result = require(`ember-svg-jar/inlined/${assetId}`).default;
  } catch (err) {}
  try {
    result = importSync(`../inlined/${assetId}`).default;
  } catch (err) {}
  return result;
}

export function svgJar(assetId, svgAttrs) {
  return makeSVG(assetId, svgAttrs, getInlineAsset);
}

export default helper(function svgJarHelper([assetId], svgAttrs) {
  return svgJar(assetId, svgAttrs);
});
