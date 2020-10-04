import { assign } from '@ember/polyfills';
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

export function getInlineSvgValues(assetId, getInlineAsset, attrs = {}) {
  let asset = getInlineAsset(assetId);

  if (!asset) {
    // eslint-disable-next-line no-console
    console.warn(`ember-svg-jar: Missing inline SVG for ${assetId}`);
    return;
  }

  let svgAttrs = asset.attrs ? assign({}, asset.attrs, attrs) : attrs;
  let { size } = attrs;

  if (size) {
    svgAttrs.width = parseFloat(svgAttrs.width) * size || svgAttrs.width;
    svgAttrs.height = parseFloat(svgAttrs.height) * size || svgAttrs.height;
    delete svgAttrs.size;
  }

  return {
    attrs: svgAttrs,
    content: asset.content
  };
}

export default function makeSvg(assetId, attrs = {}, getInlineAsset, getTemplate) {
  if (!assetId) {
    // eslint-disable-next-line no-console
    console.warn('ember-svg-jar: asset name should not be undefined or null');
    return;
  }

  let isSymbol = assetId.lastIndexOf('#', 0) === 0;
  if (isSymbol) {
    return symbolUseFor(assetId, attrs);
  }

  let processedValues = getInlineSvgValues(assetId, getInlineAsset, attrs);
  let svg = getTemplate(processedValues);

  return htmlSafe(svg);
}
