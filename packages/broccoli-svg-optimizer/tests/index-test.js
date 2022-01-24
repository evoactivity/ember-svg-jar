'use strict';

const fixture = require('broccoli-fixture');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const SVGOptimizer = require('../');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('broccoli-svg-optimizer', () => {
  let inputNode = `${__dirname}/fixtures/index`;

  it('optimizes SVG files with persistence', () => {
    let outputNode = fixture.build(new SVGOptimizer(inputNode));
    let OPTIMIZED_CONTENT = (
      '<svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M7 6V0H6v6H0v1h6v6h1V7h6V6H7z"/></svg>'
    );
    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': OPTIMIZED_CONTENT
    });
  });

  it('optimizes SVG files with without persistence', () => {
    let options = { persist: false };
    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));
    let OPTIMIZED_CONTENT = (
      '<svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M7 6V0H6v6H0v1h6v6h1V7h6V6H7z"/></svg>'
    );

    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': OPTIMIZED_CONTENT
    });
  });

  it('accepts SVGO config', () => {
    let options = {
      svgoConfig: {
        plugins: [
          { removeTitle: false },
          { removeDesc: false }
        ]
      },
      persist: false
    };
    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));
    let OPTIMIZED_CONTENT = (
      '<svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">'
      + '<title>SVG title</title>'
      + '<desc>SVG description</desc>'
      + '<path d="M7 6V0H6v6H0v1h6v6h1V7h6V6H7z"/></svg>'
    );

    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': OPTIMIZED_CONTENT
    });
  });

  it('works with callback-based SVGO module - success', () => {
    class CustomSVGO {
      optimize(svg, callback) {
        callback({ data: 'callback result' });
      }
    }

    let options = {
      svgoConfig: {},
      svgoModule: CustomSVGO,
      persist: false
    };

    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));

    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': 'callback result'
    });
  });

  it('works with callback-based SVGO module - fail', () => {
    class CustomSVGO {
      optimize(svg, callback) {
        callback({ error: 'callback error' });
      }
    }

    let options = {
      svgoConfig: {},
      svgoModule: CustomSVGO,
      persist: false
    };

    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));
    return expect(outputNode).to.be.rejectedWith('callback error');
  });

  it('works with promise-based SVGO module - success', () => {
    class CustomSVGO {
      optimize(/* svg */) {
        return Promise.resolve({ data: 'promise result' });
      }
    }

    let options = {
      svgoConfig: {},
      svgoModule: CustomSVGO,
      persist: false
    };

    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));

    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': 'promise result'
    });
  });

  it('works with promise-based SVGO module - fail', () => {
    class CustomSVGO {
      optimize(/* svg */) {
        return Promise.reject('promise error');
      }
    }

    let options = {
      svgoConfig: {},
      svgoModule: CustomSVGO,
      persist: false
    };

    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));
    return expect(outputNode).to.be.rejectedWith('promise error');
  });

  it('passes file to optimize', () => {
    class CustomSVGO {
      optimize(svg, options) {
        return Promise.resolve({ data: options && options.path });
      }
    }

    let options = {
      svgoConfig: {},
      svgoModule: CustomSVGO,
      persist: false
    };

    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));

    return expect(outputNode).to.eventually.deep.equal({
      'test.svg': 'test.svg'
    });
  });
});
