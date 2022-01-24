'use strict';

const _ = require('lodash');
const chai = require('chai');
const buildOptions = require('../../lib/build-options');
const defaultGens = require('../../lib/default-gens');

const { expect } = chai;

const defaultContainerAttrs = {
  style: 'position: absolute; width: 0; height: 0;',
  width: '0',
  height: '0',
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
};

const defaultsFixture = Object.freeze({
  rootURL: '/',
  sourceDirs: ['public'],
  strategy: ['inline'],
  stripPath: true,
  optimizer: {
    plugins: [
      { removeTitle: false },
      { removeDesc: { removeAny: false } },
      { removeViewBox: false },
    ],
  },
  persist: true,

  validations: {
    throwOnFailure: false,
    validateViewBox: true,
    checkForDuplicates: true,
  },

  viewer: {
    enabled: true,
  },

  inline: {
    idGen: defaultGens.inlineIdGen,
    copypastaGen: defaultGens.inlineCopypastaGen,
  },

  symbol: {
    idGen: defaultGens.symbolIdGen,
    copypastaGen: defaultGens.symbolCopypastaGen,
    outputFile: '/assets/symbols.svg',
    prefix: '',
    includeLoader: true,
    containerAttrs: defaultContainerAttrs,
  },
});

// SVGJar is used by an app.
function makeAppStub(env, svgJarOptions = {}) {
  return {
    env,
    options: {
      svgJar: svgJarOptions,
      trees: { public: 'public' },
    },
  };
}

// SVGJar is used by an addon.
function makeAppStubForAddon(env) {
  return {
    env,
    options: {},
    parent: {},
    root: 'addon-root',
    treePaths: { public: 'addon-public' },
  };
}

describe('buildOptions: defaults', function () {
  it('returns correct default options for app in development', function () {
    let actualOptions = buildOptions(makeAppStub('development'));
    let expectedOptions = {
      ...defaultsFixture,
      sourceDirs: ['public'],
      viewer: { enabled: true },
    };

    expect(actualOptions).to.deep.equal(expectedOptions);
  });

  it('returns correct default options for app in production', function () {
    let actualOptions = buildOptions(makeAppStub('production'));
    let expectedOptions = {
      ...defaultsFixture,
      sourceDirs: ['public'],
      viewer: { enabled: false },
    };

    expect(actualOptions).to.deep.equal(expectedOptions);
  });

  it('returns correct default options for addon in development', function () {
    let actualOptions = buildOptions(makeAppStubForAddon('development'));
    let expectedOptions = {
      ...defaultsFixture,
      sourceDirs: ['addon-root/addon-public'],
      viewer: { enabled: false },
    };

    expect(actualOptions).to.deep.equal(expectedOptions);
  });

  it('returns correct default options for addon in production', function () {
    let actualOptions = buildOptions(makeAppStubForAddon('production'));
    let expectedOptions = {
      ...defaultsFixture,
      sourceDirs: ['addon-root/addon-public'],
      viewer: { enabled: false },
    };

    expect(actualOptions).to.deep.equal(expectedOptions);
  });
});

function expectCanSetOption(optPath, optValue) {
  let svgJarOptions = _.set({}, optPath, optValue);
  let options = buildOptions(makeAppStub('development', svgJarOptions));

  expect(
    _.get(defaultsFixture, optPath),
    `option ${optPath} exists in defaults`
  ).to.exist;
  expect(
    _.get(defaultsFixture, optPath),
    `option ${optPath} differs from default one`
  ).to.not.deep.equal(optValue);
  expect(
    _.get(options, optPath),
    `${optPath} option has been set`
  ).to.deep.equal(optValue);
  expect(
    _.omit(options, optPath),
    'other default options are preserved'
  ).to.deep.equal(_.omit(defaultsFixture, optPath));
}

describe('buildOptions: custom options', function () {
  it('allows to set "rootURL" option', function () {
    expectCanSetOption('rootURL', '/custom-root');
  });

  it('allows to set "sourceDirs" option', function () {
    expectCanSetOption('sourceDirs', ['custom-dir']);
  });

  it('allows to set "strategy" option', function () {
    expectCanSetOption('strategy', ['symbol']);
  });

  it('casts "strategy" option as an array', function () {
    let svgJarOptions = { strategy: 'symbol' };
    let options = buildOptions(makeAppStub('development', svgJarOptions));

    expect(options.strategy).to.deep.equal([svgJarOptions.strategy]);
  });

  it('allows to set "stripPath" option', function () {
    expectCanSetOption('stripPath', false);
  });

  it('allows to set "optimizer" option', function () {
    expectCanSetOption('optimizer', null);
  });

  it('allows to set "persist" option', function () {
    expectCanSetOption('persist', false);
  });

  it('allows to set "validations.validateViewBox" option', function () {
    expectCanSetOption('validations.validateViewBox', false);
  });

  it('allows to set "validations.checkForDuplicates" option', function () {
    expectCanSetOption('validations.checkForDuplicates', false);
  });

  it('allows to set "viewer.enabled" option', function () {
    expectCanSetOption('viewer.enabled', false);
  });

  it('allows to set "inline.idGen" option', function () {
    expectCanSetOption('inline.idGen', null);
  });

  it('allows to set "inline.copypastaGen" option', function () {
    expectCanSetOption('inline.copypastaGen', null);
  });

  it('allows to set "symbol.idGen" option', function () {
    expectCanSetOption('symbol.idGen', null);
  });

  it('allows to set "symbol.copypastaGen" option', function () {
    expectCanSetOption('symbol.copypastaGen', null);
  });

  it('allows to set "symbol.outputFile" option', function () {
    expectCanSetOption('symbol.outputFile', '/assets/new-name.svg');
  });

  it('allows to set "symbol.prefix" option', function () {
    expectCanSetOption('symbol.prefix', 'icon-');
  });

  it('allows to set "symbol.includeLoader" option', function () {
    expectCanSetOption('symbol.includeLoader', false);
  });

  it('allows to set "symbol.containerAttrs" option', function () {
    expectCanSetOption('symbol.containerAttrs', 'test-id');
  });

  it('merges custom & default optimizer plugins', function () {
    let svgJarOptions = {
      optimizer: {
        plugins: [
          { removeViewBox: true },
          { removeUnusedNS: true },
          { removeDesc: { removeAny: true } },
        ],
      },
    };
    let {
      optimizer: { plugins: actual },
    } = buildOptions(makeAppStub('development', svgJarOptions));
    let expected = [
      { removeTitle: false },
      { removeDesc: { removeAny: true } },
      { removeViewBox: true },
      { removeUnusedNS: true },
    ];

    expect(actual).to.deep.equal(expected);
  });
});
