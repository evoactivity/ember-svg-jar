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
const validateOptions = require('./validate-options');

const symbolsLoaderScript = fs.readFileSync(
  path.join(__dirname, '../symbols-loader.html'), 'utf8'
);

const defaultGenerators = {
  symbolIdGen: (svgPath, { prefix }) => `${prefix}${svgPath}`.replace(/[\s]/g, '-'),
  symbolCopypastaGen: (assetId) => `{{svg-jar "#${assetId}"}}`,
  inlineIdGen: (svgPath) => svgPath,
  inlineCopypastaGen: (assetId) => `{{svg-jar "${assetId}"}}`
};

function mergeTreesIfNeeded(trees, options) {
  let mergedOptions = _.assign({ overwrite: true }, options);
  return trees.length === 1 ? trees[0] : new MergeTrees(trees, mergedOptions);
}

function buildOptions(customOpts = {}, env, isAddon) {
  let defaultOpts = {
    rootURL: '/',
    sourceDirs: ['public'],
    strategy: 'inline',
    stripPath: true,
    optimizer: {},
    persist: true,

    viewer: {
      enabled: env === 'development',
      embed: env === 'development'
    },

    inline: {
      idGen: defaultGenerators.inlineIdGen,
      copypastaGen: defaultGenerators.inlineCopypastaGen
    },

    symbol: {
      idGen: defaultGenerators.symbolIdGen,
      copypastaGen: defaultGenerators.symbolCopypastaGen,
      outputFile: '/assets/symbols.svg',
      prefix: '',
      includeLoader: true
    }
  };

  if(isAddon) {
    defaultOpts.sourceDirs.push('tests/dummy/public');
  }

  let options = _.merge(defaultOpts, customOpts);
  options.strategy = _.castArray(options.strategy);

  return options;
}

module.exports = {
  name: 'ember-svg-jar',

  isDevelopingAddon() {
    return false;
  },

  included(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      // eslint-disable-next-line no-param-reassign
      app = app.app;
    }

    const isAddon = this.project.isEmberCLIAddon();
    this.svgJarOptions = buildOptions(app.options.svgJar, app.env, isAddon);
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

  treeForApp(appTree) {
    let trees = [appTree];

    if (this.hasInlineStrategy()) {
      trees.push(this.getInlineStrategyTree());
    }

    return mergeTreesIfNeeded(trees);
  },

  contentFor(type) {
    let includeLoader =
        this.hasSymbolStrategy() && this.optionFor('symbol', 'includeLoader');

    if (type === 'body' && includeLoader) {
      let symbolsURL = path.join(
        this.svgJarOptions.rootURL,
        this.optionFor('symbol', 'outputFile')
      );
      return symbolsLoaderScript.replace('{{SYMBOLS_URL}}', symbolsURL);
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
      .filter((sourceDir) => fs.existsSync(sourceDir));
  },

  originalSvgsFor: _.memoize(function(strategy) {
    let sourceDirs = this.sourceDirsFor(strategy);

    return new Funnel(mergeTreesIfNeeded(sourceDirs), {
      include: ['**/*.svg']
    });
  }),

  optimizedSvgsFor: _.memoize(function(strategy, originalSvgs) {
    return new SVGOptimizer(originalSvgs, {
      svgoConfig: this.optionFor(strategy, 'optimizer'),
      persist: this.svgJarOptions.persist
    });
  }),

  svgsFor: _.memoize(function(strategy) {
    let originalSvgs = this.originalSvgsFor(strategy);

    return this.hasOptimizerFor(strategy)
      ? this.optimizedSvgsFor(strategy, originalSvgs)
      : originalSvgs;
  }),

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
        hasOptimizer: this.hasOptimizerFor(strategy),
        outputFile: `${strategy}.json`,
        ui: this.ui
      })
    ));

    return new ViewerBuilder(mergeTreesIfNeeded(viewerBuilderNodes), {
      outputFile: 'svg-jar.json'
    });
  },

  getInlineStrategyTree() {
    return new InlinePacker(this.svgsFor('inline'), {
      idGen: this.optionFor('inline', 'idGen'),
      stripPath: this.optionFor('inline', 'stripPath'),
      outputFile: 'inline-assets.js'
    });
  },

  getSymbolStrategyTree() {
    return new Symbolizer(this.svgsFor('symbol'), {
      idGen: this.optionFor('symbol', 'idGen'),
      stripPath: this.optionFor('symbol', 'stripPath'),
      outputFile: this.optionFor('symbol', 'outputFile'),
      prefix: this.optionFor('symbol', 'prefix'),
      persist: this.svgJarOptions.persist
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
