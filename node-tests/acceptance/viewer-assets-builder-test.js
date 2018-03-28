'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fixture = require('broccoli-fixture');
const ViewerAssetsBuilder = require('../../lib/viewer-assets-builder');

let expect = chai.expect;
chai.use(chaiAsPromised);

let idGens = {
  symbol: function(path, options) {
    let prefix = options.prefix || '';
    return (`${prefix}${path}`).replace(/[\s]/g, '-');
  },

  inline: function(path) { return path; }
};

let copypastaGens = {
  symbol: function(id) { return `{{svg-jar "#${id}"}}`; },
  inline: function(id) { return `{{svg-jar "${id}"}}`; }
};

describe('ViewerAssetsBuilder', function() {
  it('works for inline strategy', function() {
    let inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 13 13"><path d="original"/></svg>',
      __optimized__: {
        'foo.svg': '<svg viewBox="0 0 13 13"><path d="optimized"/></svg>'
      }
    });

    let strategy = 'inline';
    let node = new ViewerAssetsBuilder(inputNode, {
      strategy: strategy,
      idGen: idGens[strategy],
      copypastaGen: copypastaGens[strategy],
      stripPath: true,
      hasOptimizer: true,
      outputFile: `${strategy}.json`
    });

    let filesHashPromise = fixture.build(node).then(function(filesHash) {
      filesHash['inline.json'] = JSON.parse(filesHash['inline.json']);
      return filesHash;
    });

    return expect(filesHashPromise).to.eventually.deep.equal({
      'inline.json': [{
        svg: { content: '<path d="optimized"/>', attrs: { viewBox: '0 0 13 13' } },
        originalSvg: '<svg viewBox="0 0 13 13"><path d="original"/></svg>',
        width: 13,
        height: 13,
        fileName: 'foo.svg',
        fileDir: '/',
        fileSize: '0.05 KB',
        optimizedFileSize: '0.05 KB',
        baseSize: '13px',
        fullBaseSize: '13x13px',
        copypasta: '{{svg-jar "foo"}}',
        strategy: strategy
      }]
    });
  });

  it('works for symbol strategy', function() {
    let inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 20 40"><path d="original"/></svg>',
      __optimized__: {
        'foo.svg': '<svg viewBox="0 0 20 40"><path d="optimized"/></svg>'
      }
    });

    let strategy = 'symbol';
    let node = new ViewerAssetsBuilder(inputNode, {
      strategy: strategy,
      idGen: idGens[strategy],
      idGenOpts: { prefix: 'prefix-' },
      copypastaGen: copypastaGens[strategy],
      stripPath: true,
      hasOptimizer: true,
      outputFile: `${strategy}.json`
    });

    let filesHashPromise = fixture.build(node).then(function(filesHash) {
      filesHash['symbol.json'] = JSON.parse(filesHash['symbol.json']);
      return filesHash;
    });

    return expect(filesHashPromise).to.eventually.deep.equal({
      'symbol.json': [{
        svg: { content: '<path d="optimized"/>', attrs: { viewBox: '0 0 20 40' } },
        originalSvg: '<svg viewBox="0 0 20 40"><path d="original"/></svg>',
        width: 20,
        height: 40,
        fileName: 'foo.svg',
        fileDir: '/',
        fileSize: '0.05 KB',
        optimizedFileSize: '0.05 KB',
        baseSize: '40px',
        fullBaseSize: '20x40px',
        copypasta: '{{svg-jar "#prefix-foo"}}',
        strategy: strategy
      }]
    });
  });
});
