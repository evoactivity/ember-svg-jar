'use strict';

const fixture = require('broccoli-fixture');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const utils = require('../../lib/utils');
const Sympolizer = require('../../lib/symbolizer/symbolizer');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('Symbolizer', () => {
  let inputNode = new fixture.Node({
    'foo.svg': '<svg viewBox="0 0 1 1"><path d="foo"/></svg>',
    'bar.svg': '<svg height="10px" viewBox="0 0 2 2"><path d="bar"/></svg>'
  });

  it('works', () => {
    let idGen = (path, { prefix }) => {
      return (`${prefix}${path}`).replace(/[\s]/g, '-');
    };

    let options = {
      outputFile: 'symbols.svg',

      assetIdFor(relativePath) {
        return utils.assetIdFor(relativePath, { idGen, stripPath: true, prefix: '' });
      }
    };

    let actual = fixture.build(new Sympolizer(inputNode, options));
    let expected = {
      'symbols.svg': `<svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<symbol id="bar" viewBox="0 0 2 2"><path d="bar"/></symbol>
<symbol id="foo" viewBox="0 0 1 1"><path d="foo"/></symbol>
</svg>`
    };

    return expect(actual).to.eventually.deep.equal(expected);
  });
});
