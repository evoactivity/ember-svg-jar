import makeHelper from 'ember-svg-jar/utils/make-helper';
import makeSVG from 'ember-svg-jar/utils/make-svg';
import inlineAssets from '../inline-assets';

export function svgJar(assetId, svgAttrs) {
  return makeSVG(assetId, svgAttrs, inlineAssets);
}

export default makeHelper(svgJar);
