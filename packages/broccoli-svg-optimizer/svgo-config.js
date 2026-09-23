'use strict';

// The plugins svgo 1.3.0 ran by default, in the order it ran them. Legacy
// configs are converted onto this list so svgo 4 gives the same results.
const SVGO_1_PLUGINS = [
  ['removeDoctype', true],
  ['removeXMLProcInst', true],
  ['removeComments', true],
  ['removeMetadata', true],
  ['removeXMLNS', false],
  ['removeEditorsNSData', true],
  ['cleanupAttrs', true],
  ['inlineStyles', true],
  ['minifyStyles', true],
  ['convertStyleToAttrs', true],
  ['cleanupIDs', true],
  ['prefixIds', false],
  ['removeRasterImages', false],
  ['removeUselessDefs', true],
  ['cleanupNumericValues', true],
  ['cleanupListOfValues', false],
  ['convertColors', true],
  ['removeUnknownsAndDefaults', true],
  ['removeNonInheritableGroupAttrs', true],
  ['removeUselessStrokeAndFill', true],
  ['removeViewBox', true],
  ['cleanupEnableBackground', true],
  ['removeHiddenElems', true],
  ['removeEmptyText', true],
  ['convertShapeToPath', true],
  ['convertEllipseToCircle', true],
  ['moveElemsAttrsToGroup', true],
  ['moveGroupAttrsToElems', true],
  ['collapseGroups', true],
  ['convertPathData', true],
  ['convertTransform', true],
  ['removeEmptyAttrs', true],
  ['removeEmptyContainers', true],
  ['mergePaths', true],
  ['removeUnusedNS', true],
  ['sortAttrs', false],
  ['sortDefsChildren', true],
  ['removeTitle', true],
  ['removeDesc', true],
  ['removeDimensions', false],
  ['removeAttrs', false],
  ['removeAttributesBySelector', false],
  ['removeElementsByAttr', false],
  ['addClassesToSVGElement', false],
  ['removeStyleElement', false],
  ['removeScriptElement', false],
  ['addAttributesToSVGElement', false],
  ['removeOffCanvasPaths', false],
  ['reusePaths', false],
];

// svgo 1 default params that svgo 4 changed, and svgo 4 path conversions
// that svgo 1 did not have.
const SVGO_1_PARAMS = {
  convertColors: { convertCase: false },
  convertPathData: {
    convertToQ: false,
    convertToZ: false,
    smartArcRounding: false,
    noSpaceAfterFlags: true,
    // svgo 4 also drops a closing z here, which svgo 1 kept.
    removeUseless: false,
  },
  mergePaths: { noSpaceAfterFlags: true },
  removeDesc: { removeAny: true },
};

const PATH_SEGMENT = /([MmZzLlHhVvCcSsQqTtAa])([^MmZzLlHhVvCcSsQqTtAa]*)/g;
const PATH_NUMBER = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;

// Rewrites path data written by svgo 4 the way svgo 1 wrote it. Both forms
// draw the same shape:
// - svgo 4 drops the lineto after a moveto (`M1 2 3 4`), svgo 1 wrote it
//   (`M1 2L3 4`).
// - svgo 4 can start a path with `m`, svgo 1 always started with `M`. The
//   first moveto is absolute either way.
// - svgo 4 keeps the case of closepath from the source, svgo 1 wrote `z`.
function formatPathDataLikeSvgo1(d) {
  let isFirst = true;

  return d.replace(PATH_SEGMENT, (segment, command, args) => {
    if (command === 'Z' || command === 'z') {
      return 'z';
    }

    if (command !== 'M' && command !== 'm') {
      isFirst = false;
      return segment;
    }

    let lineto = command === 'm' ? 'l' : 'L';
    let moveto = isFirst ? 'M' : command;
    isFirst = false;

    PATH_NUMBER.lastIndex = 0;
    PATH_NUMBER.exec(args);
    let second = PATH_NUMBER.exec(args);
    let end = second ? PATH_NUMBER.lastIndex : args.length;
    let rest = args.slice(end).replace(/^[\s,]+/, '');

    return moveto + args.slice(0, end) + (rest ? lineto + rest : '');
  });
}

const svgo1PathData = {
  name: 'svgo1PathData',
  fn: () => ({
    element: {
      enter(node) {
        if (node.name === 'path' && node.attributes.d) {
          node.attributes.d = formatPathDataLikeSvgo1(node.attributes.d);
        }
      },
    },
  }),
};

const RENAMED_PLUGINS = {
  cleanupIDs: 'cleanupIds',
  removeScriptElement: 'removeScripts',
};

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// A legacy (svgo 1) plugin entry looks like `{ removeTitle: false }`.
// A modern entry is a plugin name string or an object with a `name`.
function isLegacyPlugin(plugin) {
  return isPlainObject(plugin) && !('name' in plugin);
}

// A config with no plugins list is treated as legacy, so it keeps the
// svgo 1 default plugins it has always had.
function isLegacyConfig(config) {
  if (!config || !Array.isArray(config.plugins)) {
    return true;
  }

  let legacyCount = config.plugins.filter(isLegacyPlugin).length;

  if (legacyCount > 0 && legacyCount < config.plugins.length) {
    throw new Error(
      'broccoli-svg-optimizer: svgoConfig.plugins mixes svgo 1 entries ' +
        '(like `{ removeTitle: false }`) with svgo 4 entries (like ' +
        "`'removeTitle'` or `{ name: 'removeTitle' }`). Use one format."
    );
  }

  return legacyCount > 0;
}

function toModernPlugin(name, value) {
  let userParams = isPlainObject(value) ? value : undefined;

  if (userParams && typeof userParams.fn === 'function') {
    throw new Error(
      `broccoli-svg-optimizer: custom svgo 1 plugin "${name}" cannot be ` +
        'converted to svgo 4. Rewrite it as an svgo 4 plugin and use the ' +
        'svgo 4 config format.'
    );
  }

  let plugin = { name: RENAMED_PLUGINS[name] || name };
  if (SVGO_1_PARAMS[name] || userParams) {
    plugin.params = Object.assign({}, SVGO_1_PARAMS[name], userParams);
  }
  return plugin;
}

function convertLegacyConfig(config) {
  config = config || {};

  let { plugins = [], full, ...rest } = config;
  let settings = new Map(
    full ? [] : SVGO_1_PLUGINS.map(([name, active]) => [name, active])
  );

  // Plugins the user adds keep svgo 1 behaviour of running after the
  // default plugins, while overrides keep their default position.
  for (let plugin of plugins) {
    let [name] = Object.keys(plugin);
    settings.set(name, plugin[name]);
  }

  let modernPlugins = [];
  for (let [name, value] of settings) {
    if (value !== false && value !== undefined && value !== null) {
      modernPlugins.push(toModernPlugin(name, value));
    }
  }

  if (settings.get('convertPathData')) {
    modernPlugins.push(svgo1PathData);
  }

  return Object.assign({}, rest, { plugins: modernPlugins });
}

function toModernConfig(config) {
  return isLegacyConfig(config) ? convertLegacyConfig(config) : config;
}

module.exports = {
  convertLegacyConfig,
  isLegacyConfig,
  formatPathDataLikeSvgo1,
  toModernConfig,
};
