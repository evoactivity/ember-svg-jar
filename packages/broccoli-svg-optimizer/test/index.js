'use strict';

var SVGOptimizer = require('../');
var fixture = require('broccoli-fixture');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

// Lint all JS files in the project with ESLint
require('mocha-eslint')('.');

describe('broccoli-svg-optimizer', function() {
  var inputNode = __dirname + '/fixtures/input-node';
  var OPTIMIZED_CONTENT = (
    '<svg width="13" height="13" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">' +
    '<title>SVG title</title><desc>SVG description</desc>' +
    '<path d="M7 6V0H6v6H0v1h6v6h1V7h6V6H7z"/></svg>'
  );

  it('optimizes SVG files with persistence', function() {
    var outputNode = fixture.build(new SVGOptimizer(inputNode));

    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': OPTIMIZED_CONTENT
    });
  });

  it('optimizes SVG files with without persistence', function() {
    var options = { persist: false };
    var outputNode = fixture.build(new SVGOptimizer(inputNode, options));

    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': OPTIMIZED_CONTENT
    });
  });

  it('SVGOptimizer defaults with persist true if no options are passed', function() {
    var outputNode = new SVGOptimizer(inputNode);

    return expect(outputNode.options).to.deep.equal({
      persist: true
    });
  });

  it('SVGOptimizer defaults with persist if no persist property is passed', function() {
    var options = { svgoConfig: {} };
    var outputNode = new SVGOptimizer(inputNode, options);

    return expect(outputNode.options).to.deep.equal({
      svgoConfig: {},
      persist: true
    });
  });
});
