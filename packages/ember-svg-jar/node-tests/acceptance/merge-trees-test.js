'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fixture = require('broccoli-fixture');
const MergeTrees = require('../../lib/merge-trees');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('MergeTrees', function () {
  it('combines the files of every input tree', function () {
    let first = new fixture.Node({
      'a.svg': 'a',
      icons: { 'b.svg': 'b' },
    });
    let second = new fixture.Node({
      'c.svg': 'c',
      icons: { 'd.svg': 'd' },
    });

    return expect(
      fixture.build(new MergeTrees([first, second]))
    ).to.eventually.deep.equal({
      'a.svg': 'a',
      'c.svg': 'c',
      icons: { 'b.svg': 'b', 'd.svg': 'd' },
    });
  });

  it('keeps the file from the later tree when paths match', function () {
    let first = new fixture.Node({
      'a.svg': 'first',
      icons: { 'b.svg': 'first' },
    });
    let second = new fixture.Node({
      'a.svg': 'second',
      icons: { 'b.svg': 'second' },
    });

    return expect(
      fixture.build(new MergeTrees([first, second]))
    ).to.eventually.deep.equal({
      'a.svg': 'second',
      icons: { 'b.svg': 'second' },
    });
  });

  it('merges an empty tree', function () {
    let first = new fixture.Node({ 'a.svg': 'a' });
    let second = new fixture.Node({});

    return expect(
      fixture.build(new MergeTrees([first, second]))
    ).to.eventually.deep.equal({ 'a.svg': 'a' });
  });
});
