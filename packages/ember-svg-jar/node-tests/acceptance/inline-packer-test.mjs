/* eslint-disable function-paren-newline */

import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fixture from 'broccoli-fixture';
import InlinePacker from '../../lib/inline-packer.js';
import { makeIDForPath } from '../../lib/utils.js';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('InlinePacker', function () {
  it('works', function () {
    let inputNode = new fixture.Node({
      'foo.svg': '<svg viewBox="0 0 1 1"><path d="foo"/></svg>',
      'bar.svg': '<svg height="10px" viewBox="0 0 2 2"><path d="bar"/></svg>',
      "apost'rophe.svg":
        '<svg height="10px" viewBox="0 0 2 2"><path d="bar"/></svg>',
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
        "apost'rophe.js":
          'export default {"content":"<path d=\\"bar\\"/>","attrs":{"height":"10px","viewBox":"0 0 2 2"}}',
        'foo.js':
          'export default {"content":"<path d=\\"foo\\"/>","attrs":{"viewBox":"0 0 1 1"}}',
        'bar.js':
          'export default {"content":"<path d=\\"bar\\"/>","attrs":{"height":"10px","viewBox":"0 0 2 2"}}',
      },
    };

    return expect(actual).to.eventually.deep.equal(expected);
  });
});
