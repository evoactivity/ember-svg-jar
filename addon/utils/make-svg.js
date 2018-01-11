import Ember from 'ember';
import { isNone } from '@ember/utils';
import { htmlSafe } from '@ember/string';

const { copy, merge } = Ember;
const { warn } = Ember.Logger;

export function formatAttrs(attrs) {
  return Object.keys(attrs)
    .map((key) => !isNone(attrs[key]) && `${key}="${attrs[key]}"`)
    .filter((attr) => attr)
    .join(' ');
}

export function symbolUseFor(assetId, attrs = {}) {
  return `<svg ${formatAttrs(attrs)}><use xlink:href="${assetId}" /></svg>`;
}

export function inlineSvgFor(assetId, loader, attrs = {}) {
  let svg = loader(assetId);

  if (!svg) {
    warn(`ember-svg-jar: Missing inline SVG for ${assetId}`);
    return;
  }

  let svgAttrs = svg.attrs ? merge(copy(svg.attrs), attrs) : attrs;
  let { size } = attrs;

  if (size) {
    svgAttrs.width = parseFloat(svgAttrs.width) * size || svgAttrs.width;
    svgAttrs.height = parseFloat(svgAttrs.height) * size || svgAttrs.height;
    delete svgAttrs.size;
  }

  return `<svg ${formatAttrs(svgAttrs)}>${svg.content}</svg>`;
}

export default function makeSvg(assetId, attrs = {}, loader) {
  let isSymbol = assetId.lastIndexOf('#', 0) === 0;
  let svg = isSymbol
    ? symbolUseFor(assetId, attrs)
    : inlineSvgFor(assetId, loader, attrs);

  return htmlSafe(svg);
}
