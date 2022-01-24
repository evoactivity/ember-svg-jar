/* eslint-disable function-paren-newline */

'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fixture = require('broccoli-fixture');
const InlinePacker = require('../../lib/inline-packer');
const { makeIDForPath } = require('../../lib/utils');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('InlinePacker', function () {
  it('works', function () {
    let inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 1 1"><path d="foo"/></svg>',
      'bar.svg': '<svg height="10px" viewBox="0 0 2 2"><path d="bar"/></svg>',
    });

    let options = {
      makeAssetID(relativePath) {
        return makeIDForPath(relativePath, {
          idGen: _ => _,
          stripPath: true,
        });
      },
    };

    let node = new InlinePacker(inputNode, options);
    let actual = fixture.build(node);

    let expected = {
      inlined: {
        'foo.js':
          'export default {"content":"<path d=\\"foo\\"/>","attrs":{"viewBox":"0 0 1 1"}}',
        'bar.js':
          'export default {"content":"<path d=\\"bar\\"/>","attrs":{"height":"10px","viewBox":"0 0 2 2"}}',
      },
    };

    return expect(actual).to.eventually.deep.equal(expected);
  });
});
