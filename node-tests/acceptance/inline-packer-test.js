/* eslint-disable function-paren-newline */

'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fixture = require('broccoli-fixture');
const InlinePacker = require('../../lib/inline-packer');
const utils = require('../../lib/utils');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('InlinePacker', function() {
  it('works', function() {
    let inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 1 1"><path d="foo"/></svg>',
      'bar.svg': '<svg height="10px" viewBox="0 0 2 2"><path d="bar"/></svg>'
    });

    let node = new InlinePacker(inputNode, {
      assetIdFor(relativePath) {
        return utils.assetIdFor(relativePath, {
          idGen: (_) => _,
          stripPath: true
        });
      }
    });

    let filesHashPromise = fixture.build(node).then(function(filesHash) {
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
