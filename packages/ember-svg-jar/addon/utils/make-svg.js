import { isNone } from '@ember/utils';
import { htmlSafe } from '@ember/template';

/**
 * This taken from https://github.com/emberjs/ember.js/blob/089a021b1b5c5f8ea1cb574fcd841a73af7b2031/packages/%40ember/-internals/glimmer/lib/helpers/unique-id.ts#L44
 * In the future it should be possible to import this function like
 * `import { uniqueId } from '@ember/helper`
 * see https://github.com/emberjs/ember.js/pull/20165
 */
function uniqueId() {
  return ([3e7] + -1e3 + -4e3 + -2e3 + -1e11).replace(/[0-3]/g, a =>
    ((a * 4) ^ ((Math.random() * 16) >> (a & 2))).toString(16)
  );
}

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
  if (typeof text === 'number') return text;
  if (text === null) return null;
  if (typeof text !== 'string') return '';

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

export function generateAccessibilityIds(attrs) {
  if (attrs.title) {
    attrs.title = {
      id: uniqueId(),
      text: attrs.title,
    };
  }

  if (attrs.desc) {
    attrs.desc = {
      id: uniqueId(),
      text: attrs.desc,
    };
  }

  return attrs;
}

export function createAccessibilityElements(attrs) {
  const { title, desc } = attrs;

  if (!title && !desc) {
    return '';
  }

  return accessibilityElements.reduce((elements, tag) => {
    if (attrs[tag]) {
      return elements.concat(
        `<${tag} id="${attrs[tag].id}">${attrs[tag].text}</${tag}>`
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
    .map(tag => attrs[tag].id)
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

  attrs = sanitizeAttrs(attrs);
  attrs = generateAccessibilityIds(attrs);

  let isSymbol = assetId.lastIndexOf('#', 0) === 0;
  let svg = isSymbol
    ? symbolUseFor(assetId, attrs)
    : inlineSvgFor(assetId, getInlineAsset, attrs);

  return htmlSafe(svg);
}
