import { isNone } from 'ember-utils';

export default function formatAttrs(attrs) {
  let svgAttrs = [];
  Object.keys(attrs).forEach((attrName) => {
    let attrValue = attrs[attrName];

    if (!isNone(attrValue)) {
      svgAttrs.push(`${attrName}="${attrValue}"`);
    }
  });

  return svgAttrs.join(' ');
}
