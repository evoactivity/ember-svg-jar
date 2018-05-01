'use strict';

const SVGOptimizer = require('../');
const fixture = require('broccoli-fixture');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('broccoli-svg-optimizer', () => {
  let inputNode = `${__dirname}/fixtures/index`;

  it('optimizes SVG files with persistence', () => {
    let outputNode = fixture.build(new SVGOptimizer(inputNode));
    let OPTIMIZED_CONTENT = (
      '<svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">' +
      '<title>SVG title</title>' +
      '<desc>SVG description</desc>' +
      '<path d="M7 6V0H6v6H0v1h6v6h1V7h6V6H7z"/></svg>'
    );
    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': OPTIMIZED_CONTENT
    });
  });

  it('optimizes SVG files with without persistence', () => {
    let options = { persist: false };
    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));
    let OPTIMIZED_CONTENT = (
      '<svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">' +
      '<title>SVG title</title>' +
      '<desc>SVG description</desc>' +
      '<path d="M7 6V0H6v6H0v1h6v6h1V7h6V6H7z"/></svg>'
    );

    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': OPTIMIZED_CONTENT
    });
  });

  it('accepts SVGO config', () => {
    let options = {
      svgoConfig: {
        plugins: [
          { removeTitle: true },
          { removeDesc: { removeAny: true } }
        ]
      }
    };
    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));
    let OPTIMIZED_CONTENT = (
      '<svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M7 6V0H6v6H0v1h6v6h1V7h6V6H7z"/></svg>'
    );

    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': OPTIMIZED_CONTENT
    });
  });
});
