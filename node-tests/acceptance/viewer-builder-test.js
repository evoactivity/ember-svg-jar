'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var fixture = require('broccoli-fixture');
var ViewerBuilder = require('../../lib/viewer-builder');

var expect = chai.expect;
chai.use(chaiAsPromised);

describe('ViewerBuilder', function() {
  it('works', function() {
    var inputNode = new fixture.Node({
      'symbol.json': JSON.stringify([{
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
        strategy: 'symbol'
      }]),

      'inline.json': JSON.stringify([{
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
        strategy: 'inline'
      }])
    });

    var node = new ViewerBuilder(inputNode, {
      outputFile: 'svg-jar.json',
      hasManyStrategies: true
    });

    var filesHashPromise = fixture.build(node).then(function(filesHash) {
      filesHash['svg-jar.json'] = JSON.parse(filesHash['svg-jar.json']);
      return filesHash;
    });

    /* eslint-disable max-len */
    return expect(filesHashPromise).to.eventually.deep.equal({
      'svg-jar.json': {
        assets: [
          {
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
            strategy: 'inline'
          },
          {
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
            strategy: 'symbol'
          }
        ],

        details: [
          { name: 'File name', key: 'fileName' },
          { name: 'Directory', key: 'fileDir' },
          { name: 'Base size', key: 'fullBaseSize' },
          { name: 'Original file size', key: 'fileSize' },
          { name: 'Optimized file size', key: 'optimizedFileSize' },
          { name: 'Strategy', key: 'strategy' }
        ],

        searchKeys: ['fileName', 'fileDir'],

        sortBy: [
          { name: 'File name', key: 'fileName' },
          { name: 'Base size', key: 'height' }
        ],

        arrangeBy: [
          { name: 'Directory', key: 'fileDir' },
          { name: 'Base size', key: 'baseSize' }
        ],

        filters: [
          { name: 'Directory', key: 'fileDir', items: [{ count: 2, name: '/' }] },
          { name: 'Base size', key: 'baseSize', items: [{ count: 1, name: '13px' }, { count: 1, name: '40px' }] },
          { name: 'Strategy', key: 'strategy', items: [{ count: 1, name: 'inline' }, { count: 1, name: 'symbol' }] }
        ],

        links: [
          { text: 'Contribute', url: 'https://github.com/ivanvotti/ember-svg-jar' },
          { text: 'About', url: 'https://github.com/ivanvotti/ember-svg-jar/blob/master/README.md' }
        ]
      }
    });
  });
});
