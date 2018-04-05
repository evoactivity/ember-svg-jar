'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const SVGOptimizer = require('broccoli-svg-optimizer');
const Symbolizer = require('broccoli-symbolizer');
const broccoliReplace = require('broccoli-string-replace');
const InlinePacker = require('./inline-packer');
const ViewerAssetsBuilder = require('./viewer-assets-builder');
const ViewerBuilder = require('./viewer-builder');
const buildOptions = require('./build-options');
const validateOptions = require('./validate-options');

const symbolsLoaderScript = fs.readFileSync(
  path.join(__dirname, '../symbols-loader.html'), 'utf8'
);

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

    let customOpts = app.options.svgJar;
    let isUsedByAddon = !!app.parent;
    let isDevelopment = app.env === 'development';
    let defaultSourceDir;

    if (isUsedByAddon) {
      // We are being used by an addon.
      // SVGJar options are coming from from the addon's index.js.
      // The default source for SVGs is the addon's public directory.
      defaultSourceDir = path.join(app.root, app.treePaths.public);
    } else {
      // We are being used by an app (including the dummy app of an addon).
      // SVGJar options are coming from the app's ember-cli-build.js
      // The default source for SVGs is the app's public directory.
      defaultSourceDir = app.options.trees.public;
    }

    this.svgJarOptions = buildOptions(
      customOpts, defaultSourceDir, isUsedByAddon, isDevelopment
    );
    validateOptions(this.svgJarOptions);
  },

  treeForPublic() {
    let trees = [];

    if (this.svgJarOptions.viewer.enabled) {
      trees.push(this.getViewerTree());

      if (this.svgJarOptions.viewer.embed) {
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

  contentFor(type, app) {
    let includeLoader =
        this.hasSymbolStrategy() && this.optionFor('symbol', 'includeLoader');

    if (type === 'body' && includeLoader) {
      let symbolsURL = path.join(
        this.svgJarOptions.rootURL,
        this.optionFor('symbol', 'outputFile')
      );

      let symbolsSelector = app.environment === 'test' ?
        '#ember-testing' :
        'body';

      return symbolsLoaderScript
        .replace('{{SYMBOLS_URL}}', symbolsURL)
        .replace('{{SYMBOLS_SELECTOR}}', symbolsSelector);
    }

    return '';
  },

  optionFor(strategy, optionName) {
    // globalOptions can be both root or strategy specific.
    const globalOptions = ['sourceDirs', 'stripPath', 'optimizer'];

    return _.isUndefined(this.svgJarOptions[strategy][optionName])
      ? globalOptions.indexOf(optionName) !== -1 && this.svgJarOptions[optionName]
      : this.svgJarOptions[strategy][optionName];
  },

  sourceDirsFor(strategy) {
    return this.optionFor(strategy, 'sourceDirs')
      .filter((sourceDir) => typeof sourceDir !== 'string' || fs.existsSync(sourceDir));
  },

  originalSvgsFor(strategy) {
    let sourceDirs = this.sourceDirsFor(strategy);

    return new Funnel(mergeTreesIfNeeded(sourceDirs), {
      include: ['**/*.svg']
    });
  },

  optimizedSvgsFor(strategy, originalSvgs) {
    return new SVGOptimizer(originalSvgs, {
      svgoConfig: this.optionFor(strategy, 'optimizer'),
      persist: this.svgJarOptions.persist
    });
  },

  svgsFor(strategy) {
    let originalSvgs = this.originalSvgsFor(strategy);

    return this.hasOptimizerFor(strategy)
      ? this.optimizedSvgsFor(strategy, originalSvgs)
      : originalSvgs;
  },

  viewerSvgsFor(strategy) {
    let originalSvgs = this.originalSvgsFor(strategy);
    let nodes = [originalSvgs];

    if (this.hasOptimizerFor(strategy)) {
      let optimizedSvgs = this.optimizedSvgsFor(strategy, originalSvgs);
      nodes.push(new Funnel(optimizedSvgs, { destDir: '__optimized__' }));
    }

    return mergeTreesIfNeeded(nodes);
  },

  getViewerTree() {
    let idGenOpts = {
      symbol: {
        prefix: this.optionFor('symbol', 'prefix')
      }
    };

    let viewerBuilderNodes = this.svgJarOptions.strategy.map((strategy) => (
      new ViewerAssetsBuilder(this.viewerSvgsFor(strategy), {
        strategy,
        idGen: this.optionFor(strategy, 'idGen'),
        idGenOpts: idGenOpts[strategy],
        copypastaGen: this.optionFor(strategy, 'copypastaGen'),
        stripPath: this.optionFor(strategy, 'stripPath'),
        validations: this.svgJarOptions.validations,
        hasOptimizer: this.hasOptimizerFor(strategy),
        outputFile: `${strategy}.json`,
        ui: this.ui
      })
    ));

    return new ViewerBuilder(mergeTreesIfNeeded(viewerBuilderNodes), {
      outputFile: 'svg-jar-viewer.json'
    });
  },

  getInlineStrategyTree() {
    return new InlinePacker(this.svgsFor('inline'), {
      idGen: this.optionFor('inline', 'idGen'),
      stripPath: this.optionFor('inline', 'stripPath')
    });
  },

  getSymbolStrategyTree() {
    return new Symbolizer(this.svgsFor('symbol'), {
      idGen: this.optionFor('symbol', 'idGen'),
      stripPath: this.optionFor('symbol', 'stripPath'),
      outputFile: this.optionFor('symbol', 'outputFile'),
      prefix: this.optionFor('symbol', 'prefix'),
      persist: this.svgJarOptions.persist,
      svgAttrs: this.optionFor('symbol', 'containerAttrs')
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
