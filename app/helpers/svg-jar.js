import Ember from 'ember';
import { htmlSafe } from 'ember-string';
import inlineAssets from '../inline-assets';

const { warn } = Ember.Logger;

function symbolFor(assetId) {
  return `<svg><use xlink:href="${assetId}" /></svg>`;
}

function inlineSVGFor(assetId) {
  let svg = inlineAssets[assetId];

  if (!svg) {
    warn(`ember-svg-jar: Missing inline SVG for ${assetId}`);
  }

  return svg;
}

export function svgJar(assetId, options = {}) {
  let isSymbol = assetId.lastIndexOf('#', 0) === 0;
  let svg = isSymbol ? symbolFor(assetId) : inlineSVGFor(assetId);

  if (svg && options.class) {
    svg = svg.replace('<svg', `<svg class="${options.class}"`);
  }

  return svg;
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
