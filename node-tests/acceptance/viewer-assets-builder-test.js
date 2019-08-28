'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fixture = require('broccoli-fixture');
const ViewerAssetsBuilder = require('../../lib/viewer-assets-builder');
const { makeIDForPath } = require('../../lib/utils');

const { expect } = chai;
chai.use(chaiAsPromised);

const idGens = {
  symbol: (path, { prefix }) => `${prefix}${path}`.replace(/[\s]/g, '-'),
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

      makeAssetID(relativePath) {
        return makeIDForPath(relativePath, {
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
      'inline.json': [
        {
          id: 'unknown-foo.svg',
          svg: '<svg viewBox="0 0 13 13"><path d="original"/></svg>',
          gridHeight: 13,
          gridWidth: 13,
          fileName: 'foo.svg',
          fileDir: 'unknown',
          fileSize: 0.05,
          strategy: strategy,
          helper: '{{svg-jar "foo"}}'
        }
      ]
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

      makeAssetID(relativePath) {
        return makeIDForPath(relativePath, {
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
      'symbol.json': [
        {
          id: 'unknown-foo.svg',
          svg: '<svg viewBox="0 0 20 40"><path d="original"/></svg>',
          gridHeight: 40,
          gridWidth: 20,
          fileName: 'foo.svg',
          fileDir: 'unknown',
          fileSize: 0.05,
          strategy: strategy,
          helper: '{{svg-jar "#prefix-foo"}}',
        }
      ]
    });
  });
});
