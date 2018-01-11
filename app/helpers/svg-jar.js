import makeHelper from 'ember-svg-jar/utils/make-helper';
import makeSVG from 'ember-svg-jar/utils/make-svg';

function loader(assetId) {
  try {
    /* eslint-disable global-require */
    return require(`ember-svg-jar/inlined/${assetId}`).default;
  } catch (err) {
    return null;
  }
}

export function svgJar(assetId, svgAttrs) {
  return makeSVG(assetId, svgAttrs, loader);
}

export default makeHelper(svgJar);
