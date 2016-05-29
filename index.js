'use strict';

var fs = require('fs');
var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var SVGOptimizer = require('broccoli-svg-optimizer');
var Symbolizer = require('broccoli-symbolizer');
var defaults = require('lodash.defaults');

var ajaxingCode = fs.readFileSync(path.join(__dirname, 'ajaxing-code.html'), 'utf8');

module.exports = {
  name: 'ember-svg-jar',

  initializeOptions: function(options) {
    if (!options || !options.sourceDirs) {
      throw new Error('sourceDirs is required by ember-svg-jar');
    }

    this.options = defaults(options || {}, {
      outputFile: '/assets/symbols.svg',
      optimize: {},
      prefix: '',
      ajaxing: false,
      persist: true
    });
  },

  included: function(app) {
    this.initializeOptions(app.options.svgJar);
  },

  getSourceNodes: function() {
    var nodes = this.options.sourceDirs.filter(function(sourceDir) {
      return fs.existsSync(sourceDir);
    });

    return nodes.length === 1 ? nodes[0] : MergeTrees(nodes);
  },

  treeForPublic: function() {
    var svgFiles = new Funnel(this.getSourceNodes(), {
      include: ['**/*.svg']
    });

    if (this.options.optimize) {
      svgFiles = new SVGOptimizer(svgFiles, {
        svgoConfig: this.options.optimize,
        persist: this.options.persist
      });
    }

    var outputSvgFile = new Symbolizer(svgFiles, {
      outputFile: this.options.outputFile,
      prefix: this.options.prefix,
      persist: this.options.persist
    });

    return outputSvgFile;
  },

  contentFor: function(type) {
    if (this.options.ajaxing && type === 'body') {
      return ajaxingCode.replace('{{SVG_FILE}}', this.options.outputFile);
    }

    return '';
  }
};
