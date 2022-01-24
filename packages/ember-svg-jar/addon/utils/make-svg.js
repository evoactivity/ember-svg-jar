import { isNone } from '@ember/utils';
import { htmlSafe } from '@ember/template';

const accessibilityElements = ['title', 'desc'];

const ESC = {
  '"': '&quot;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

function matcher(char) {
  return ESC[char];
}

function escapeText(text) {
  if (typeof text !== 'string') {
    return '';
  }

  if (
    text.indexOf('>') > -1 ||
    text.indexOf('<') > -1 ||
    text.indexOf('&') > -1 ||
    text.indexOf('"') > -1
  ) {
    return text.replace(/[&"<>]/g, matcher);
  }

  return text;
}

export function sanitizeAttrs(attrs) {
  let attrsCopy = Object.assign({}, attrs);

  Object.keys(attrsCopy).forEach(key => {
    attrsCopy[key] = escapeText(attrsCopy[key]);
  });

  return attrsCopy;
}

export function createAccessibilityElements(attrs) {
  const sanitizedAttrs = sanitizeAttrs(attrs);
  const { title, desc } = sanitizedAttrs;

  if (!title && !desc) {
    return '';
  }

  return accessibilityElements.reduce((elements, tag) => {
    if (sanitizedAttrs[tag]) {
      return elements.concat(
        `<${tag} id="${tag}">${sanitizedAttrs[tag]}</${tag}>`
      );
    }
    return elements;
  }, '');
}

export function createAriaLabel(attrs) {
  const { title, desc } = attrs;

  if (!title && !desc) {
    return '';
  }

  return `aria-labelledby="${accessibilityElements
    .filter(tag => attrs[tag])
    .join(' ')}"`;
}

export function formatAttrs(attrs) {
  return Object.keys(attrs)
    .filter(attr => !accessibilityElements.includes(attr))
    .map(key => !isNone(attrs[key]) && `${key}="${attrs[key]}"`)
    .filter(attr => attr)
    .join(' ');
}

export function symbolUseFor(assetId, attrs = {}) {
  return `<svg ${formatAttrs(attrs)}${createAriaLabel(
    attrs
  )}><use xlink:href="${assetId}" />${createAccessibilityElements(
    attrs
  )}</svg>`;
}

export function inlineSvgFor(assetId, getInlineAsset, attrs = {}) {
  let asset = getInlineAsset(assetId);

  if (!asset) {
    // eslint-disable-next-line no-console
    console.warn(`ember-svg-jar: Missing inline SVG for ${assetId}`);
    return;
  }

  let svgAttrs = asset.attrs ? Object.assign({}, asset.attrs, attrs) : attrs;
  let { size } = attrs;

  if (size) {
    svgAttrs.width = parseFloat(svgAttrs.width) * size || svgAttrs.width;
    svgAttrs.height = parseFloat(svgAttrs.height) * size || svgAttrs.height;
    delete svgAttrs.size;
  }

  return `<svg ${formatAttrs(svgAttrs)}${createAriaLabel(
    attrs
  )}>${createAccessibilityElements(attrs)}${asset.content}</svg>`;
}

export default function makeSvg(assetId, attrs = {}, getInlineAsset) {
  if (!assetId) {
    // eslint-disable-next-line no-console
    console.warn('ember-svg-jar: asset name should not be undefined or null');
    return;
  }

  let isSymbol = assetId.lastIndexOf('#', 0) === 0;
  let svg = isSymbol
    ? symbolUseFor(assetId, attrs)
    : inlineSvgFor(assetId, getInlineAsset, attrs);

  return htmlSafe(svg);
}
