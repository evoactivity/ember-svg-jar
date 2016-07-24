import Ember from 'ember';
import Helper from 'ember-helper';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { htmlSafe } from 'ember-string';

const { warn } = Ember.Logger;

export default Helper.extend({
  svgJar: service(),

  compute(params, options={}) {
    if (!params || params && params.length > 1) {
      throw new TypeError('svg-jar: Invalid Number of arguments, at most 1');
    }

    let svgName = params[0];
    let isSymbol = svgName.lastIndexOf('#', 0) === 0;
    let svg;

    if (isSymbol) {
      svg = this.getSymbolUse(svgName);
    } else {
      svg = this.getInlineSVG(svgName);
    }

    if (svg && options.class) {
      svg = svg.replace('<svg', `<svg class="${options.class}"`);
    }

    return htmlSafe(svg);
  },

  getSymbolUse(svgName) {
    return `<svg><use xlink:href="${svgName}" /></svg>`;
  },

  getInlineSVG(svgName) {
    let svgs = get(this, 'svgJar.svgs');
    let svg = svgs[svgName];  // svgName can content dots

    if (!svg) {
      warn(`svg-jar: Missing inline SVG for ${svgName}`);
    }

    return svg;
  }
});
