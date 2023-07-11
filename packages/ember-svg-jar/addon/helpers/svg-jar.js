import { helper } from '@ember/component/helper';
import makeSVG from 'ember-svg-jar/utils/make-svg';
import assets from '../inlined';

function getInlineAsset(assetId) {
  try {
    return assets[assetId]().default;
  } catch (err) {
    return null;
  }
}

export function svgJar(assetId, svgAttrs) {
  return makeSVG(assetId, svgAttrs, getInlineAsset);
}

export default helper(function svgJarHelper([assetId], svgAttrs) {
  return svgJar(assetId, svgAttrs);
});
