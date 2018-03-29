'use strict';

const chai = require('chai');
const buildOptions = require('../../lib/build-options');

const expect = chai.expect;


let defaultContainerAttrs = {
  style: 'position: absolute; width: 0; height: 0;',
  width: '0',
  height: '0',
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': 'http://www.w3.org/1999/xlink'
};

let defaultOpts = {
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
    enabled: true,
    embed: true
  },

  inline: {
    idGen: () => null,
    copypastaGen: () => null
  },

  symbol: {
    idGen: () => null,
    copypastaGen: () => null,
    outputFile: '/assets/symbols.svg',
    prefix: '',
    includeLoader: true,
    containerAttrs: defaultContainerAttrs
  }
};

describe('buildOptions', function() {
  it('returns correct default options', function() {
    let customOpts = null;
    let isUsedByAddon = false;
    let isDevelopment = true;
    let defaultSourceDir = 'public';

    let options = buildOptions(
      customOpts, defaultSourceDir, isUsedByAddon, isDevelopment
    );

    return expect(JSON.stringify(options)).to.deep.equal(JSON.stringify(defaultOpts));
  });

  it('returns correct default containerAttrs', function() {
    let customOpts = null;
    let isUsedByAddon = false;
    let isDevelopment = true;
    let defaultSourceDir = 'public';

    let options = buildOptions(
      customOpts, defaultSourceDir, isUsedByAddon, isDevelopment
    );

    return expect(options.symbol.containerAttrs)
      .to.deep.equal(defaultContainerAttrs);
  });

  it('returns correct custom containerAttrs', function() {
    let customOpts = {
      symbol: {
        containerAttrs: {
          id: 'test-id'
        }
      }
    };

    let isUsedByAddon = false;
    let isDevelopment = true;
    let defaultSourceDir = 'public';

    let options = buildOptions(
      customOpts, defaultSourceDir, isUsedByAddon, isDevelopment
    );

    return expect(options.symbol.containerAttrs)
      .to.deep.equal(customOpts.symbol.containerAttrs);
  });
});
