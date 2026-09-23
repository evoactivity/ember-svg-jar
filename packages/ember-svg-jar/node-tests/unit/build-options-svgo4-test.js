'use strict';

const chai = require('chai');
const buildOptions = require('../../lib/build-options');

const { expect } = chai;

function makeAppStub(svgJarOptions) {
  return {
    env: 'development',
    options: {
      svgJar: svgJarOptions,
      trees: { public: 'public' },
    },
  };
}

describe('buildOptions with svgo 4 optimizer plugins', function () {
  it('uses svgo 4 plugins without merging the svgo 1 defaults', function () {
    let plugins = [
      'preset-default',
      'removeDimensions',
      { name: 'removeAttrs', params: { attrs: 'fill' } },
    ];
    let options = buildOptions(makeAppStub({ optimizer: { plugins } }));

    expect(options.optimizer.plugins).to.deep.equal(plugins);
  });

  it('keeps other optimizer options', function () {
    let options = buildOptions(
      makeAppStub({
        optimizer: { multipass: true, plugins: ['preset-default'] },
      })
    );

    expect(options.optimizer.multipass).to.equal(true);
    expect(options.optimizer.plugins).to.deep.equal(['preset-default']);
  });

  it('still merges svgo 1 plugins with the defaults', function () {
    let options = buildOptions(
      makeAppStub({ optimizer: { plugins: [{ removeTitle: true }] } })
    );

    expect(options.optimizer.plugins).to.deep.equal([
      { removeTitle: true },
      { removeDesc: { removeAny: false } },
      { removeViewBox: false },
    ]);
  });
});
