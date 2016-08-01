import Ember from 'ember';
import { isNone } from 'ember-utils';

const { copy, merge } = Ember;
const { warn } = Ember.Logger;

export function formatAttrs(attrs) {
  return Object.keys(attrs)
    .map((key) => !isNone(attrs[key]) && `${key}="${attrs[key]}"`)
    .filter((attr) => attr)
    .join(' ');
}

export function symbolUseFor(assetId, svgAttrs) {
  return `<svg ${formatAttrs(svgAttrs)}><use xlink:href="${assetId}" /></svg>`;
}

export function inlineSvgFor(assetId, svgAttrs, inlineStore) {
  let svg = inlineStore[assetId];

  if (!svg) {
    warn(`ember-svg-jar: Missing inline SVG for ${assetId}`);
    return;
  }

  let attrs = svg.attrs ? merge(copy(svg.attrs), svgAttrs) : svgAttrs;
  return `<svg ${formatAttrs(attrs)}>${svg.content}</svg>`;
}

export default function makeSVG(assetId, svgAttrs, inlineStore = {}) {
  let isSymbol = assetId.lastIndexOf('#', 0) === 0;
  return isSymbol
    ? symbolUseFor(assetId, svgAttrs)
    : inlineSvgFor(assetId, svgAttrs, inlineStore);
}
