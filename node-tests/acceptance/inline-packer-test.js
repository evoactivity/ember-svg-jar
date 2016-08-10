'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var fixture = require('broccoli-fixture');
var InlinePacker = require('../../lib/inline-packer');

var expect = chai.expect;
chai.use(chaiAsPromised);

describe('InlinePacker', function() {
  it('works without moduleExport', function() {
    var inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 1 1"><path d="foo"/></svg>',
      'bar.svg': '<svg height="10px" viewBox="0 0 2 2"><path d="bar"/></svg>'
    });

    var node = new InlinePacker(inputNode, {
      idGen: function(filePath) { return filePath; },
      stripPath: true,
      outputFile: 'no-export.js',
      moduleExport: false
    });

    var filesHashPromise = fixture.build(node).then(function(filesHash) {
      filesHash['no-export.js'] = JSON.parse(filesHash['no-export.js']);
      return filesHash;
    });

    return expect(filesHashPromise).to.eventually.deep.equal({
      'no-export.js': {
        foo: { content: '<path d="foo"/>', attrs: { viewBox: '0 0 1 1' } },
        bar: { content: '<path d="bar"/>', attrs: { height: '10px', viewBox: '0 0 2 2' } }
      }
    });
  });

  it('works with moduleExport', function() {
    var inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 1 1"><path d="foo"/></svg>',
      'bar.svg': '<svg height="10px" viewBox="0 0 2 2"><path d="bar"/></svg>'
    });

    var node = new InlinePacker(inputNode, {
      idGen: function(filePath) { return filePath; },
      stripPath: true,
      outputFile: 'with-export.js',
      moduleExport: true
    });

    var filesHashPromise = fixture.build(node).then(function(filesHash) {
      expect(filesHash['with-export.js'].indexOf('export default ')).to.equal(0);

      filesHash['with-export.js'] = JSON.parse(
        filesHash['with-export.js'].replace('export default ', '')
      );

      return filesHash;
    });

    return expect(filesHashPromise).to.eventually.deep.equal({
      'with-export.js': {
        foo: { content: '<path d="foo"/>', attrs: { viewBox: '0 0 1 1' } },
        bar: { content: '<path d="bar"/>', attrs: { height: '10px', viewBox: '0 0 2 2' } }
      }
    });
  });
});
