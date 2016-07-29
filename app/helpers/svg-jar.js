import Ember from 'ember';
import { htmlSafe } from 'ember-string';
import formatAttrs from 'ember-svg-jar/utils/format-attrs';
import inlineAssets from '../inline-assets';

const { merge } = Ember;
const { warn } = Ember.Logger;

export function symbolUseFor(assetId, attrs) {
  return `<svg ${formatAttrs(attrs)}><use xlink:href="${assetId}" /></svg>`;
}

export function inlineSVGFor(assetId, attrs) {
  let svg = inlineAssets[assetId];

  if (!svg) {
    warn(`ember-svg-jar: Missing inline SVG for ${assetId}`);
    return;
  }

  let svgAttrs = formatAttrs(merge(svg.attrs, attrs));
  return `<svg ${svgAttrs}>${svg.content}</svg>`;
}

export function svgJar(assetId, attrs = {}) {
  let isSymbol = assetId.lastIndexOf('#', 0) === 0;
  return isSymbol ? symbolUseFor(assetId, attrs) : inlineSVGFor(assetId, attrs);
}

let svgJarHelper;

if (Ember.Helper && Ember.Helper.helper) {
  svgJarHelper = Ember.Helper.helper(function([assetId], options) {
    return htmlSafe(svgJar(assetId, options));
  });
} else {
  svgJarHelper = Ember.Handlebars.makeBoundHelper(function(assetId, options) {
    return htmlSafe(svgJar(assetId, options.hash));
  });
}

export default svgJarHelper;
