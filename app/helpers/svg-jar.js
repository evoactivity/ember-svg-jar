import { htmlSafe } from 'ember-string';
import makeHelper from 'ember-svg-jar/utils/make-helper';
import makeSVG from 'ember-svg-jar/utils/make-svg';
import inlineAssets from '../inline-assets';

export default makeHelper((assetId, svgAttrs) => (
  htmlSafe(makeSVG(assetId, svgAttrs, inlineAssets))
));
