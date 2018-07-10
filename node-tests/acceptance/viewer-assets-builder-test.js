'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fixture = require('broccoli-fixture');
const ViewerAssetsBuilder = require('../../lib/viewer-assets-builder');
const utils = require('../../lib/utils');

const { expect } = chai;
chai.use(chaiAsPromised);

const idGens = {
  symbol: (path, { prefix }) => {
    return (`${prefix}${path}`).replace(/[\s]/g, '-');
  },

  inline: (path) => path
};

const copypastaGens = {
  symbol: (id) => `{{svg-jar "#${id}"}}`,
  inline: (id) => `{{svg-jar "${id}"}}`
};

describe('ViewerAssetsBuilder', function() {
  it('works for inline strategy', function() {
    let inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 13 13"><path d="original"/></svg>'
    });

    let strategy = 'inline';
    let node = new ViewerAssetsBuilder(inputNode, {
      strategy: strategy,
      copypastaGen: copypastaGens[strategy],

      assetIdFor(relativePath) {
        return utils.assetIdFor(relativePath, {
          idGen: idGens[strategy],
          stripPath: true
        });
      }
    });

    let filesHashPromise = fixture.build(node).then(function(filesHash) {
      filesHash['inline.json'] = JSON.parse(filesHash['inline.json']);
      return filesHash;
    });

    return expect(filesHashPromise).to.eventually.deep.equal({
      'inline.json': [{
        svg: { content: '<path d="original"/>', attrs: { viewBox: '0 0 13 13' } },
        width: 13,
        height: 13,
        fileName: 'foo.svg',
        fileDir: '/',
        fileSize: '0.05 KB',
        baseSize: '13px',
        fullBaseSize: '13x13px',
        copypasta: '{{svg-jar "foo"}}',
        strategy: strategy
      }]
    });
  });

  it('works for symbol strategy', function() {
    let inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 20 40"><path d="original"/></svg>'
    });

    let strategy = 'symbol';
    let node = new ViewerAssetsBuilder(inputNode, {
      strategy: strategy,
      copypastaGen: copypastaGens[strategy],

      assetIdFor(relativePath) {
        return utils.assetIdFor(relativePath, {
          idGen: idGens[strategy],
          stripPath: true,
          prefix: 'prefix-'
        });
      }
    });

    let filesHashPromise = fixture.build(node).then(function(filesHash) {
      filesHash['symbol.json'] = JSON.parse(filesHash['symbol.json']);
      return filesHash;
    });

    return expect(filesHashPromise).to.eventually.deep.equal({
      'symbol.json': [{
        svg: { content: '<path d="original"/>', attrs: { viewBox: '0 0 20 40' } },
        width: 20,
        height: 40,
        fileName: 'foo.svg',
        fileDir: '/',
        fileSize: '0.05 KB',
        baseSize: '40px',
        fullBaseSize: '20x40px',
        copypasta: '{{svg-jar "#prefix-foo"}}',
        strategy: strategy
      }]
    });
  });
});
