import { copy } from '@ember/object/internals';
import { merge } from '@ember/polyfills';
import { isNone } from '@ember/utils';
import { htmlSafe } from '@ember/string';

export function formatAttrs(attrs) {
  return Object.keys(attrs)
    .map((key) => !isNone(attrs[key]) && `${key}="${attrs[key]}"`)
    .filter((attr) => attr)
    .join(' ');
}

export function symbolUseFor(assetId, attrs = {}) {
  return `<svg ${formatAttrs(attrs)}><use xlink:href="${assetId}" /></svg>`;
}

export function inlineSvgFor(assetId, getInlineAsset, attrs = {}) {
  const asset = getInlineAsset(assetId);

  if (!asset) {
    // eslint-disable-next-line no-console
    console.warn(`ember-svg-jar: Missing inline SVG for ${assetId}`);
    return;
  }

  const svgAttrs = asset.attrs ? merge(copy(asset.attrs), attrs) : attrs;
  const { size } = attrs;

  if (size) {
    svgAttrs.width = parseFloat(svgAttrs.width) * size || svgAttrs.width;
    svgAttrs.height = parseFloat(svgAttrs.height) * size || svgAttrs.height;
    delete svgAttrs.size;
  }

  return `<svg ${formatAttrs(svgAttrs)}>${asset.content}</svg>`;
}

export default function makeSvg(assetId, attrs = {}, getInlineAsset) {
  const isSymbol = assetId.lastIndexOf('#', 0) === 0;
  const svg = isSymbol
    ? symbolUseFor(assetId, attrs)
    : inlineSvgFor(assetId, getInlineAsset, attrs);

  return htmlSafe(svg);
}
