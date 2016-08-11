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

export function inlineSvgFor(assetId, svgAttrs, inlineStore, sizeFactor) {
  let svg = inlineStore[assetId];

  if (!svg) {
    warn(`ember-svg-jar: Missing inline SVG for ${assetId}`);
    return;
  }

  let attrs = svg.attrs ? merge(copy(svg.attrs), svgAttrs) : svgAttrs;

  if (sizeFactor) {
    attrs.width = parseFloat(attrs.width) * sizeFactor || attrs.width;
    attrs.height = parseFloat(attrs.height) * sizeFactor || attrs.height;
  }

  return `<svg ${formatAttrs(attrs)}>${svg.content}</svg>`;
}

export default function makeSvg(assetId, svgAttrs, inlineStore = {}) {
  let isSymbol = assetId.lastIndexOf('#', 0) === 0;
  let sizeFactor;

  if (svgAttrs.size) {
    sizeFactor = svgAttrs.size;
    // eslint-disable-next-line no-param-reassign
    delete svgAttrs.size;
  }

  return isSymbol
    ? symbolUseFor(assetId, svgAttrs)
    : inlineSvgFor(assetId, svgAttrs, inlineStore, sizeFactor);
}
