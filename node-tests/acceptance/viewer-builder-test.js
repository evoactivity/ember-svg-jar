'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fixture = require('broccoli-fixture');
const ViewerBuilder = require('../../lib/viewer-builder');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('ViewerBuilder', function () {
  it('works', function () {
    let inputNode = new fixture.Node({
      'symbol.json': JSON.stringify([
        {
          svg: {
            content: '<path d="optimized"/>',
            attrs: { viewBox: '0 0 20 40' },
          },
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
          strategy: 'symbol',
        },
      ]),

      'inline.json': JSON.stringify([
        {
          svg: {
            content: '<path d="optimized"/>',
            attrs: { viewBox: '0 0 13 13' },
          },
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
          strategy: 'inline',
        },
      ]),
    });

    let node = new ViewerBuilder(inputNode, {
      outputFile: 'svg-jar.json',
      hasManyStrategies: true,
    });

    let filesHashPromise = fixture.build(node).then(function (filesHash) {
      filesHash['svg-jar.json'] = JSON.parse(filesHash['svg-jar.json']);
      return filesHash;
    });

    /* eslint-disable max-len */
    return expect(filesHashPromise).to.eventually.deep.equal({
      'svg-jar.json': {
        assets: [
          {
            svg: {
              content: '<path d="optimized"/>',
              attrs: { viewBox: '0 0 13 13' },
            },
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
            strategy: 'inline',
          },
          {
            svg: {
              content: '<path d="optimized"/>',
              attrs: { viewBox: '0 0 20 40' },
            },
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
            strategy: 'symbol',
          },
        ],
      },
    });
  });
});
