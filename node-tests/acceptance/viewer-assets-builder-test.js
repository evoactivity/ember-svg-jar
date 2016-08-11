'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var fixture = require('broccoli-fixture');
var ViewerAssetsBuilder = require('../../lib/viewer-assets-builder');

var expect = chai.expect;
chai.use(chaiAsPromised);

var idGens = {
  symbol: function(path, options) {
    var prefix = options.prefix || '';
    return ('' + prefix + path).replace(/[\s]/g, '-');
  },

  inline: function(path) { return path; }
};

var copypastaGens = {
  symbol: function(id) { return '{{svg-jar "#' + id + '"}}'; },
  inline: function(id) { return '{{svg-jar "' + id + '"}}'; }
};

describe('ViewerAssetsBuilder', function() {
  it('works for inline strategy', function() {
    var inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 13 13"><path d="optimized"/></svg>',
      __original__: {
        'foo.svg': '<svg viewBox="0 0 13 13"><path d="original"/></svg>'
      }
    });

    var strategy = 'inline';
    var node = new ViewerAssetsBuilder(inputNode, {
      strategy: strategy,
      idGen: idGens[strategy],
      copypastaGen: copypastaGens[strategy],
      stripPath: true,
      outputFile: strategy + '.json'
    });

    var filesHashPromise = fixture.build(node).then(function(filesHash) {
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
    var inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 20 40"><path d="optimized"/></svg>',
      __original__: {
        'foo.svg': '<svg viewBox="0 0 20 40"><path d="original"/></svg>'
      }
    });

    var strategy = 'symbol';
    var node = new ViewerAssetsBuilder(inputNode, {
      strategy: strategy,
      idGen: idGens[strategy],
      idGenOpts: { prefix: 'prefix-' },
      copypastaGen: copypastaGens[strategy],
      stripPath: true,
      outputFile: strategy + '.json'
    });

    var filesHashPromise = fixture.build(node).then(function(filesHash) {
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
