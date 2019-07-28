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
  'xmlns:xlink': 'http://www.w3.org/1999/xlink'
};

const defaultOpts = {
  rootURL: '/',
  sourceDirs: ['public'],
  strategy: ['inline'],
  stripPath: true,
  optimizer: {},
  persist: true,

  validations: {
    validateViewBox: true,
    checkForDuplicates: true
  },

  viewer: {
    enabled: true
  },

  inline: {
    idGen: defaultGens.inlineIdGen,
    copypastaGen: defaultGens.inlineCopypastaGen
  },

  symbol: {
    idGen: defaultGens.symbolIdGen,
    copypastaGen: defaultGens.symbolCopypastaGen,
    outputFile: '/assets/symbols.svg',
    prefix: '',
    includeLoader: true,
    containerAttrs: defaultContainerAttrs
  }
};

// SVGJar is used by an app.
function makeAppStub(env) {
  return {
    env,
    options: {
      trees: { public: 'public' }
    }
  };
}

// SVGJar is used by an addon.
function makeAppStubForAddon(env) {
  return {
    env,
    options: {},
    parent: {},
    root: 'addon-root',
    treePaths: { public: 'addon-public' }
  };
}

function expectCanSetOption(optPath, customOpts) {
  this.appStub.options.svgJar = customOpts;
  let options = buildOptions(this.appStub);

  expect(_.get(this.defaultOpts, optPath), `custom ${optPath} differs from the default one`)
    .to.not.deep.equal(_.get(customOpts, optPath));
  expect(_.get(options, optPath), `${optPath} option has been set`)
    .to.deep.equal(_.get(customOpts, optPath));
  expect(_.omit(options, optPath), 'other default options are preserved')
    .to.deep.equal(_.omit(this.defaultOpts, optPath));
}

describe('buildOptions', function() {
  beforeEach(function() {
    this.defaultOpts = _.cloneDeep(defaultOpts);
    this.appStub = makeAppStub('development');
    this.expectCanSetOption = expectCanSetOption.bind(this);
  });

  it('returns correct default options for development', function() {
    let options = buildOptions(this.appStub);
    expect(options).to.deep.equal(this.defaultOpts);
  });

  it('returns correct default options for production', function() {
    let options = buildOptions(makeAppStub('production'));
    this.defaultOpts.viewer.enabled = false;
    expect(options).to.deep.equal(this.defaultOpts);
  });

  it('returns correct default options for addon for development', function() {
    let options = buildOptions(makeAppStubForAddon('development'));
    this.defaultOpts.sourceDirs = ['addon-root/addon-public'];
    this.defaultOpts.viewer.enabled = false;
    expect(options).to.deep.equal(this.defaultOpts);
  });

  it('returns correct default options for addon for production', function() {
    let options = buildOptions(makeAppStubForAddon('production'));
    this.defaultOpts.sourceDirs = ['addon-root/addon-public'];
    this.defaultOpts.viewer.enabled = false;
    expect(options).to.deep.equal(this.defaultOpts);
  });

  it('allows to set "rootURL" option', function() {
    this.expectCanSetOption('rootURL', { rootURL: '/custom-root' });
  });

  it('allows to set "sourceDirs" option', function() {
    this.expectCanSetOption('sourceDirs', { sourceDirs: ['custom-dir'] });
  });

  it('allows to set "strategy" option', function() {
    this.expectCanSetOption('strategy', { strategy: ['symbol'] });
  });

  it('casts "strategy" option as an array', function() {
    let customOpts = { strategy: 'symbol' };
    this.appStub.options.svgJar = customOpts;
    let options = buildOptions(this.appStub);
    expect(options.strategy).to.deep.equal([customOpts.strategy]);
  });

  it('allows to set "stripPath" option', function() {
    this.expectCanSetOption('stripPath', { stripPath: false });
  });

  it('allows to set "optimizer" option', function() {
    this.expectCanSetOption('optimizer', { optimizer: { plugins: [] } });
  });

  it('allows to set "persist" option', function() {
    this.expectCanSetOption('persist', { persist: false });
  });

  it('allows to set "validations.validateViewBox" option', function() {
    this.expectCanSetOption('validations.validateViewBox', {
      validations: { validateViewBox: false }
    });
  });

  it('allows to set "validations.checkForDuplicates" option', function() {
    this.expectCanSetOption('validations.checkForDuplicates', {
      validations: { checkForDuplicates: false }
    });
  });

  it('allows to set "viewer.enabled" option', function() {
    this.expectCanSetOption('viewer.enabled', {
      viewer: { enabled: false }
    });
  });

  it('allows to set "inline.idGen" option', function() {
    this.expectCanSetOption('inline.idGen', {
      inline: { idGen: null }
    });
  });

  it('allows to set "inline.copypastaGen" option', function() {
    this.expectCanSetOption('inline.copypastaGen', {
      inline: { copypastaGen: null }
    });
  });

  it('allows to set "symbol.idGen" option', function() {
    this.expectCanSetOption('symbol.idGen', {
      symbol: { idGen: null }
    });
  });

  it('allows to set "symbol.copypastaGen" option', function() {
    this.expectCanSetOption('symbol.copypastaGen', {
      symbol: { copypastaGen: null }
    });
  });

  it('allows to set "symbol.outputFile" option', function() {
    this.expectCanSetOption('symbol.outputFile', {
      symbol: { outputFile: '/assets/new-name.svg' }
    });
  });

  it('allows to set "symbol.prefix" option', function() {
    this.expectCanSetOption('symbol.prefix', {
      symbol: { prefix: 'icon-' }
    });
  });

  it('allows to set "symbol.includeLoader" option', function() {
    this.expectCanSetOption('symbol.includeLoader', {
      symbol: { includeLoader: false }
    });
  });

  it('allows to set "symbol.containerAttrs" option', function() {
    this.expectCanSetOption('symbol.containerAttrs', {
      symbol: {
        containerAttrs: { id: 'test-id' }
      }
    });
  });
});
