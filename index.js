'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var SVGOptimizer = require('broccoli-svg-optimizer');
var Symbolizer = require('broccoli-symbolizer');
var InlinePacker = require('./lib/inline-packer');
var ViewerAssetsBuilder = require('./lib/viewer-assets-builder');
var ViewerBuilder = require('./lib/viewer-builder');
var defaultGenerators = require('./lib/generators');

var symbolsLoaderScript = fs.readFileSync(
  path.join(__dirname, 'symbols-loader.html'), 'utf8'
);

function mergeTreesIfNeeded(trees, options) {
  return trees.length === 1 ? trees[0] : new MergeTrees(trees, options);
}

module.exports = {
  name: 'ember-svg-jar',

  isDevelopingAddon: function() {
    return false;
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.initializeOptions(app.options.svgJar, app.env);
  },

  treeForPublic: function() {
    var trees = [];

    if (this.options.viewer.enabled) {
      trees.push(this.getViewerTree());

      if (this.options.viewer.embed) {
        trees.push(this._super.treeForPublic.apply(this, arguments));
      }
    }

    if (this.hasSymbolStrategy()) {
      trees.push(this.getSymbolStrategyTree());
    }

    return mergeTreesIfNeeded(trees);
  },

  treeForApp: function(appTree) {
    var trees = [appTree];

    if (this.hasInlineStrategy()) {
      trees.push(this.getInlineStrategyTree());
    }

    return mergeTreesIfNeeded(trees, { overwrite: true });
  },

  contentFor: function(type) {
    var includeLoader =
        this.hasSymbolStrategy() && this.options.symbol.includeLoader;

    if (type === 'body' && includeLoader) {
      return symbolsLoaderScript
        .replace('{{FILE_PATH}}', this.options.symbol.outputFile);
    }

    return '';
  },

  initializeOptions: function(options, env) {
    this.options = _.merge({
      strategy: 'inline',
      persist: true,
      optimizer: {},

      viewer: {
        enabled: env === 'development',
        embed: env === 'development'
      },

      inline: {
        sourceDirs: ['public'],
        idGen: defaultGenerators.inlineIDGen,
        copypastaGen: defaultGenerators.inlineCopypastaGen
      },

      symbol: {
        sourceDirs: ['public'],
        outputFile: '/assets/symbols.svg',
        prefix: '',
        idGen: defaultGenerators.symbolIDGen,
        copypastaGen: defaultGenerators.symbolCopypastaGen,
        includeLoader: true
      }
    }, options || {});

    if (_.isString(this.options.strategy)) {
      this.options.strategy = [this.options.strategy];
    }
  },

  svgFilesFor: function(strategy) {
    this.svgFilesCache = this.svgFilesCache || {};

    if (this.svgFilesCache[strategy]) {
      return this.svgFilesCache[strategy];
    }

    var sourceDirs = this.options[strategy].sourceDirs
      .filter(function(sourceDir) {
        return fs.existsSync(sourceDir);
      });

    var svgFiles = new Funnel(mergeTreesIfNeeded(sourceDirs), {
      include: ['**/*.svg']
    });

    if (this.options.optimizer) {
      svgFiles = new SVGOptimizer(svgFiles, {
        svgoConfig: this.options.optimizer,
        persist: this.options.persist
      });
    }

    this.svgFilesCache[strategy] = svgFiles;

    return svgFiles;
  },

  getViewerTree: function() {
    var idGenOptions = {
      symbol: { prefix: this.options.symbol.prefix }
    };

    var viewerInputNodes = this.options.strategy.map(function(strategy) {
      return new ViewerAssetsBuilder(this.svgFilesFor(strategy), {
        outputFile: strategy + '.json',
        strategy: strategy,
        idGen: this.options[strategy].idGen,
        idGenOptions: idGenOptions[strategy],
        copypastaGen: this.options[strategy].copypastaGen
      });
    }.bind(this));

    return new ViewerBuilder(mergeTreesIfNeeded(viewerInputNodes), {
      outputFile: 'svg-jar.json'
    });
  },

  getSymbolStrategyTree: function() {
    return new Symbolizer(this.svgFilesFor('symbol'), {
      outputFile: this.options.symbol.outputFile,
      idGen: this.options.symbol.idGen,
      prefix: this.options.symbol.prefix,
      persist: this.options.persist
    });
  },

  getInlineStrategyTree: function() {
    return new InlinePacker(this.svgFilesFor('inline'), {
      outputFile: 'svgs.js',
      idGen: this.options.inline.idGen
    });
  },

  hasSymbolStrategy: function() {
    return this.options.strategy.indexOf('symbol') !== -1;
  },

  hasInlineStrategy: function() {
    return this.options.strategy.indexOf('inline') !== -1;
  }
};
