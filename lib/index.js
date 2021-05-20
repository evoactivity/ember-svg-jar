'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const SVGOptimizer = require('broccoli-svg-optimizer');
const broccoliReplace = require('broccoli-string-replace');
const Symbolizer = require('./symbolizer/symbolizer');
const InlinePacker = require('./inline-packer');
const ViewerAssetsBuilder = require('./viewer-assets-builder');
const ViewerBuilder = require('./viewer-builder');
const buildOptions = require('./build-options');
const { toPosixPath, makeIDForPath } = require('./utils');

const symbolsLoaderScript = fs.readFileSync(path.join(__dirname, '../symbols-loader.html'), 'utf8');

function mergeTreesIfNeeded(trees, options) {
  let mergedOptions = _.assign({ overwrite: true }, options);
  return trees.length === 1 ? trees[0] : new MergeTrees(trees, mergedOptions);
}

module.exports = {
  name: 'ember-svg-jar',

  isDevelopingAddon() {
    return false;
  },

  included(app) {
    this._super.included.apply(this, arguments);
    this.svgJarOptions = buildOptions(app);
  },

  treeForPublic() {
    let trees = [];

    if (this.svgJarOptions.viewer.enabled) {
      // Add `svg-jar-viewer.json` to public dir
      trees.push(this.getViewerTree());

      // Add viewer assets to public dir
      let svgJarPublicTree = this._super.treeForPublic.apply(this, arguments);

      svgJarPublicTree = broccoliReplace(svgJarPublicTree, {
        files: ['**/index.html'],
        pattern: {
          match: /\{\{ROOT_URL\}\}/g,
          replacement: this.svgJarOptions.rootURL
        }
      });

      trees.push(svgJarPublicTree);
    }

    if (this.hasSymbolStrategy()) {
      trees.push(this.getSymbolStrategyTree());
    }

    return mergeTreesIfNeeded(trees);
  },

  treeForAddon(addonTree) {
    let trees = [addonTree];

    if (this.hasInlineStrategy()) {
      trees.push(this.getInlineStrategyTree());
    }

    return this._super.treeForAddon.call(this, mergeTreesIfNeeded(trees));
  },

  contentFor(type) {
    let includeLoader = this.hasSymbolStrategy() && this.optionFor('symbol', 'includeLoader');

    if (type === 'body' && includeLoader) {
      let symbolsURL = path.join(
        this.svgJarOptions.rootURL,
        this.optionFor('symbol', 'outputFile')
      );
      return symbolsLoaderScript.replace('{{SYMBOLS_URL}}', toPosixPath(symbolsURL));
    }

    return '';
  },

  optionFor(strategy, optionName) {
    // globalOptions can be both root or strategy specific.
    let globalOptions = ['sourceDirs', 'stripPath', 'optimizer'];

    return _.isUndefined(this.svgJarOptions[strategy][optionName])
      ? globalOptions.indexOf(optionName) !== -1 && this.svgJarOptions[optionName]
      : this.svgJarOptions[strategy][optionName];
  },

  sourceDirsFor(strategy) {
    return this.optionFor(strategy, 'sourceDirs').filter(
      (sourceDir) => typeof sourceDir !== 'string' || fs.existsSync(sourceDir)
    );
  },

  originalSvgsFor(strategy) {
    let sourceDirs = this.sourceDirsFor(strategy);

    return new Funnel(mergeTreesIfNeeded(sourceDirs), {
      include: ['**/*.svg']
    });
  },

  optimizedSvgsFor(strategy, originalSvgs) {
    let optimizerConfig = this.optionFor(strategy, 'optimizer');

    return new SVGOptimizer(originalSvgs, {
      svgoConfig: _.omit(optimizerConfig, 'svgoModule'),
      svgoModule: optimizerConfig.svgoModule,
      persist: this.svgJarOptions.persist
    });
  },

  svgsFor(strategy) {
    let originalSvgs = this.originalSvgsFor(strategy);

    return this.hasOptimizerFor(strategy)
      ? this.optimizedSvgsFor(strategy, originalSvgs)
      : originalSvgs;
  },

  getViewerTree() {
    let viewerBuilderTrees = this.svgJarOptions.strategy.map((strategy) => {
      let idGen = this.optionFor(strategy, 'idGen');
      let stripPath = this.optionFor(strategy, 'stripPath');
      let prefix = this.optionFor(strategy, 'prefix');

      return new ViewerAssetsBuilder(this.svgsFor(strategy), {
        strategy,
        validationConfig: this.svgJarOptions.validations,
        copypastaGen: this.optionFor(strategy, 'copypastaGen'),

        makeAssetID(relativePath) {
          return makeIDForPath(relativePath, { idGen, stripPath, prefix });
        }
      });
    });

    return new ViewerBuilder(mergeTreesIfNeeded(viewerBuilderTrees), {
      outputFile: 'svg-jar-viewer.json'
    });
  },

  getInlineStrategyTree() {
    let idGen = this.optionFor('inline', 'idGen');
    let stripPath = this.optionFor('inline', 'stripPath');

    return new InlinePacker(this.svgsFor('inline'), {
      makeAssetID(relativePath) {
        return makeIDForPath(relativePath, { idGen, stripPath });
      }
    });
  },

  getSymbolStrategyTree() {
    let idGen = this.optionFor('symbol', 'idGen');
    let stripPath = this.optionFor('symbol', 'stripPath');
    let prefix = this.optionFor('symbol', 'prefix');

    return new Symbolizer(this.svgsFor('symbol'), {
      outputFile: this.optionFor('symbol', 'outputFile'),
      svgAttrs: this.optionFor('symbol', 'containerAttrs'),
      persist: this.svgJarOptions.persist,

      makeAssetID(relativePath) {
        return makeIDForPath(relativePath, { idGen, stripPath, prefix });
      }
    });
  },

  hasOptimizerFor(strategy) {
    return this.optionFor(strategy, 'optimizer');
  },

  hasInlineStrategy() {
    return this.svgJarOptions.strategy.indexOf('inline') !== -1;
  },

  hasSymbolStrategy() {
    return this.svgJarOptions.strategy.indexOf('symbol') !== -1;
  }
};
