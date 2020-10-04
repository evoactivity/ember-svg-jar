import makeHelper from 'ember-svg-jar/utils/make-helper';
import makeSVG, { formatAttrs } from 'ember-svg-jar/utils/make-svg';

export function getInlineAsset(assetId) {
  try {
    /* eslint-disable global-require */
    return require(`ember-svg-jar/inlined/${assetId}`).default;
  } catch (err) {
    return null;
  }
}

const InlineSvgTemplate = ({ attrs, content }) => `<svg ${formatAttrs(attrs)}>${content}</svg>`;

export function svgJar(assetId, svgAttrs, template = InlineSvgTemplate) {
  return makeSVG(assetId, svgAttrs, getInlineAsset, template);
}

export default makeHelper(svgJar);
