'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var fixture = require('broccoli-fixture');
var InlinePacker = require('../../lib/inline-packer');

var expect = chai.expect;
chai.use(chaiAsPromised);

describe('InlinePacker', function() {
  it('works', function() {
    var inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 1 1"><path d="foo"/></svg>',
      'bar.svg': '<svg height="10px" viewBox="0 0 2 2"><path d="bar"/></svg>'
    });

    var node = new InlinePacker(inputNode, {
      idGen: function(filePath) { return filePath; },
      stripPath: true
    });

    var filesHashPromise = fixture.build(node).then(function(filesHash) {
      expect(filesHash.inlined['foo.js'].indexOf('export default ')).to.equal(0);

      filesHash.inlined['foo.js'] = JSON.parse(
        filesHash.inlined['foo.js'].replace('export default ', '')
      );

      expect(filesHash.inlined['bar.js'].indexOf('export default ')).to.equal(0);
      filesHash.inlined['bar.js'] = JSON.parse(
        filesHash.inlined['bar.js'].replace('export default ', '')
      );

      return filesHash;
    });

    return expect(filesHashPromise).to.eventually.deep.equal({
      inlined: {
        'foo.js':
        { content: '<path d="foo"/>', attrs: { viewBox: '0 0 1 1' } },
        'bar.js':
        { content: '<path d="bar"/>', attrs: { height: '10px', viewBox: '0 0 2 2' } }
      }
    });
  });
});
