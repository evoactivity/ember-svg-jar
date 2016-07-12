'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var SVGOptimizer = require('broccoli-svg-optimizer');
var Symbolizer = require('broccoli-symbolizer');
var AssetsPacker = require('./lib/assets-packer');
var DemoBuilder = require('./lib/demo-builder');

var ajaxingScript = fs.readFileSync(path.join(__dirname, 'ajaxing.html'), 'utf8');

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

    if (this.options.embedDemo) {
      trees.push(this._super.treeForPublic.apply(this, arguments));
    }

    if (this.options.buildDemoData) {
      trees.push(this.getDemoTree());
    }

    if (this.isSymbolStrategy()) {
      trees.push(this.getSymbolStrategyTree());
    }

    return mergeTreesIfNeeded(trees);
  },

  treeForApp: function(appTree) {
    var trees = [appTree];

    if (this.isInlineStrategy()) {
      trees.push(this.getInlineStrategyTree());
    }

    return mergeTreesIfNeeded(trees, { overwrite: true });
  },

  contentFor: function(type) {
    if (type === 'body' && this.isSymbolStrategy() && this.options.injectSymbols) {
      return ajaxingScript.replace('{{FILE_PATH}}', this.options.symbolsFile);
    }

    return '';
  },

  initializeOptions: function(options, env) {
    if (!options || !options.sourceDirs) {
      throw new Error('sourceDirs is required by ember-svg-jar');
    }

    this.options = _.defaults(options || {}, {
      strategy: 'inline',
      trimPath: false,  // remove directories from the inline asset key
      embedDemo: env === 'development',
      buildDemoData: env === 'development',
      optimize: {},
      symbolsFile: '/assets/symbols.svg',
      symbolsPrefix: '',
      injectSymbols: true,
      persist: true
    });
  },

  getSVGFiles: function() {
    if (this._svgFiles) {
      return this._svgFiles;
    }

    var sourceDirs = this.options.sourceDirs.filter(function(sourceDir) {
      return fs.existsSync(sourceDir);
    });

    var svgFiles = new Funnel(mergeTreesIfNeeded(sourceDirs), {
      include: ['**/*.svg']
    });

    if (this.options.optimize) {
      svgFiles = new SVGOptimizer(svgFiles, {
        svgoConfig: this.options.optimize,
        persist: this.options.persist
      });
    }

    this._svgFiles = svgFiles;

    return svgFiles;
  },

  getDemoTree: function() {
    return new DemoBuilder(this.getSVGFiles(), {
      outputFile: 'svg-jar.json',
      strategy: this.options.strategy,
      symbolsPrefix: this.options.symbolsPrefix,
      trimPath: this.options.trimPath
    });
  },

  getSymbolStrategyTree: function() {
    return new Symbolizer(this.getSVGFiles(), {
      outputFile: this.options.symbolsFile,
      prefix: this.options.symbolsPrefix,
      persist: this.options.persist
    });
  },

  getInlineStrategyTree: function() {
    return new AssetsPacker(this.getSVGFiles(), {
      outputFile: 'svgs.js',
      moduleExport: true,
      trimPath: this.options.trimPath
    });
  },

  isSymbolStrategy: function() {
    return this.options.strategy === 'symbol';
  },

  isInlineStrategy: function() {
    return this.options.strategy === 'inline';
  }
};
