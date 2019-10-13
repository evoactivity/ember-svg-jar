'use strict';

const fixture = require('broccoli-fixture');
const chai = require('chai');
const Symbolizer = require('../../lib/symbolizer/symbolizer');

const { expect } = chai;

describe('Symbolizer', function() {
  this.timeout(8000);

  beforeEach(function() {
    this.options = {
      outputFile: 'symbols.svg',
      makeAssetID: (relativePath) => relativePath
    };
  });

  it('works', async function() {
    let input = {
      'bar.svg': '<svg width="100" viewBox="0 0 1 1"><path d="bar"/></svg>',
      'foo.svg': '<svg style="position: absolute;" viewBox="0 0 2 2"><path d="foo"/></svg>'
    };

    let actual = await fixture.build(new Symbolizer(new fixture.Node(input), this.options));
    let expected = {
      'symbols.svg': `<svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<symbol id="bar.svg" viewBox="0 0 1 1"><path d="bar"/></symbol>
<symbol id="foo.svg" viewBox="0 0 2 2"><path d="foo"/></symbol>
</svg>
`
    };

    return expect(actual).to.deep.equal(expected);
  });

  it('sets correct default SVG attributes', async function() {
    let input = { 'foo.svg': '<svg><path d=""/></svg>' };
    let result = await fixture.build(new Symbolizer(new fixture.Node(input), this.options));
    let expected = '<svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';

    expect(result[this.options.outputFile]).to.include(expected);
  });

  it('sets custom SVG attributes', async function() {
    this.options.svgAttrs = {
      width: '10',
      height: '20',
    };

    let input = { 'foo.svg': '<svg><path d=""/></svg>' };
    let result = await fixture.build(new Symbolizer(new fixture.Node(input), this.options));
    let expected = '<svg width="10" height="20">';

    expect(result[this.options.outputFile]).to.include(expected);
  });

  it('sets correct symbol IDs', async function() {
    this.options.makeAssetID = (relativePath) => `test-id-${relativePath}`;

    let input = {
      'bar.svg': '<svg><path d="bar"/></svg>',
      'foo.svg': '<svg><path d="foo"/></svg>'
    };

    let result = await fixture.build(new Symbolizer(new fixture.Node(input), this.options));
    let expected = '<symbol id="test-id-bar.svg"><path d="bar"/></symbol>\n<symbol id="test-id-foo.svg"><path d="foo"/></symbol>';
    expect(result[this.options.outputFile]).to.include(expected);
  });

  it('only exports viewBox attribute to symbols', async function() {
    let input = {
      'bar.svg': '<svg width="100" viewBox="0 0 1 1"><path d="bar"/></svg>',
      'foo.svg': '<svg style="position: absolute;" viewBox="0 0 2 2"><path d="foo"/></svg>'
    };

    let result = await fixture.build(new Symbolizer(new fixture.Node(input), this.options));
    let expected = '<symbol id="bar.svg" viewBox="0 0 1 1"><path d="bar"/></symbol>\n<symbol id="foo.svg" viewBox="0 0 2 2"><path d="foo"/></symbol>';
    expect(result[this.options.outputFile]).to.include(expected);
  });
});
