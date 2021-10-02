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
  inline: path => path,
};

const copypastaGens = {
  symbol: id => `{{svg-jar "#${id}"}}`,
  inline: id => `{{svg-jar "${id}"}}`,
};

describe('ViewerAssetsBuilder', function () {
  it('works for inline strategy', function () {
    let inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 13 13"><path d="original"/></svg>',
    });

    let strategy = 'inline';
    let node = new ViewerAssetsBuilder(inputNode, {
      strategy: strategy,
      copypastaGen: copypastaGens[strategy],

      makeAssetID(relativePath) {
        return makeIDForPath(relativePath, {
          idGen: idGens[strategy],
          stripPath: true,
        });
      },
    });

    let filesHashPromise = fixture.build(node).then(function (filesHash) {
      filesHash['inline.json'] = JSON.parse(filesHash['inline.json']);
      return filesHash;
    });

    return expect(filesHashPromise).to.eventually.deep.equal({
      'inline.json': [
        {
          id: '0-inline',
          svg: '<svg viewBox="0 0 13 13"><path d="original"/></svg>',
          gridHeight: 13,
          gridWidth: 13,
          fileName: 'foo.svg',
          fileDir: '/root',
          fileSize: 0.05,
          strategy: strategy,
          helper: '{{svg-jar "foo"}}',
        },
      ],
    });
  });

  it('works for symbol strategy', function () {
    let inputNode = new fixture.Node({
      'root.svg': '<svg viewBox="0 0 20 40"><path d="original"/></svg>',
      circles: {
        'circle.svg': '<svg width="20" height="40"><path d="original"/></svg>',
      },
      logos: {
        'logo.svg': '<svg width="20" height="40"><path d="original"/></svg>',
      },
    });

    let strategy = 'symbol';
    let node = new ViewerAssetsBuilder(inputNode, {
      strategy: strategy,
      copypastaGen: copypastaGens[strategy],

      makeAssetID(relativePath) {
        return makeIDForPath(relativePath, {
          idGen: idGens[strategy],
          stripPath: true,
          prefix: 'prefix-',
        });
      },
    });

    let filesHashPromise = fixture.build(node).then(function (filesHash) {
      filesHash['symbol.json'] = JSON.parse(filesHash['symbol.json']);
      return filesHash;
    });

    return expect(filesHashPromise).to.eventually.deep.equal({
      'symbol.json': [
        {
          id: '0-symbol',
          svg: '<svg width="20" height="40"><path d="original"/></svg>',
          gridWidth: 20,
          gridHeight: 40,
          fileName: 'circle.svg',
          fileDir: 'circles',
          fileSize: 0.05,
          helper: '{{svg-jar "#prefix-circle"}}',
          strategy: 'symbol',
        },
        {
          id: '1-symbol',
          svg: '<svg width="20" height="40"><path d="original"/></svg>',
          gridWidth: 20,
          gridHeight: 40,
          fileName: 'logo.svg',
          fileDir: 'logos',
          fileSize: 0.05,
          helper: '{{svg-jar "#prefix-logo"}}',
          strategy: 'symbol',
        },
        {
          id: '2-symbol',
          svg: '<svg viewBox="0 0 20 40"><path d="original"/></svg>',
          gridWidth: 20,
          gridHeight: 40,
          fileName: 'root.svg',
          fileDir: '/root',
          fileSize: 0.05,
          helper: '{{svg-jar "#prefix-root"}}',
          strategy: 'symbol',
        },
      ],
    });
  });
});
