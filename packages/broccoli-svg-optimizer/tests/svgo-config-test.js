'use strict';

const { expect } = require('chai');
const {
  convertLegacyConfig,
  formatPathDataLikeSvgo1,
  isLegacyConfig,
  toModernConfig,
} = require('../svgo-config');

function pluginNames(config) {
  return config.plugins.map(plugin => plugin.name);
}

function findPlugin(config, name) {
  return config.plugins.find(plugin => plugin.name === name);
}

describe('svgo-config', () => {
  describe('isLegacyConfig', () => {
    it('treats a missing config or plugins list as legacy', () => {
      expect(isLegacyConfig(undefined)).to.equal(true);
      expect(isLegacyConfig({})).to.equal(true);
      expect(isLegacyConfig({ multipass: true })).to.equal(true);
    });

    it('detects svgo 1 plugin entries', () => {
      let config = { plugins: [{ removeTitle: false }] };
      expect(isLegacyConfig(config)).to.equal(true);
    });

    it('detects svgo 4 plugin entries', () => {
      let config = {
        plugins: ['preset-default', { name: 'removeTitle' }],
      };
      expect(isLegacyConfig(config)).to.equal(false);
    });

    it('throws when both formats are mixed', () => {
      let config = { plugins: [{ removeTitle: false }, 'removeDesc'] };
      expect(() => isLegacyConfig(config)).to.throw(/mixes svgo 1 entries/);
    });
  });

  describe('convertLegacyConfig', () => {
    it('enables the svgo 1 default plugins in svgo 1 order', () => {
      let names = pluginNames(convertLegacyConfig({}));

      expect(names).to.include('removeTitle');
      expect(names).to.include('removeViewBox');
      expect(names).to.not.include('removeDimensions');
      expect(names.indexOf('removeDoctype')).to.equal(0);
      expect(names.indexOf('convertPathData')).to.be.below(
        names.indexOf('removeTitle')
      );
    });

    it('renames plugins that svgo 4 renamed', () => {
      let names = pluginNames(
        convertLegacyConfig({ plugins: [{ removeScriptElement: true }] })
      );

      expect(names).to.include('cleanupIds');
      expect(names).to.include('removeScripts');
      expect(names).to.not.include('cleanupIDs');
      expect(names).to.not.include('removeScriptElement');
    });

    it('disables plugins set to false', () => {
      let names = pluginNames(
        convertLegacyConfig({ plugins: [{ removeTitle: false }] })
      );

      expect(names).to.not.include('removeTitle');
    });

    it('merges plugin params over the svgo 1 defaults', () => {
      let config = convertLegacyConfig({
        plugins: [{ removeDesc: { removeAny: false } }],
      });

      expect(findPlugin(config, 'removeDesc').params).to.deep.equal({
        removeAny: false,
      });
      expect(findPlugin(config, 'convertPathData').params).to.include({
        convertToZ: false,
        noSpaceAfterFlags: true,
      });
    });

    it('keeps default plugins in place and adds other plugins last', () => {
      let config = convertLegacyConfig({
        plugins: [{ removeXlink: true }, { sortAttrs: true }],
      });
      let names = pluginNames(config);

      expect(names.indexOf('sortAttrs')).to.equal(
        names.indexOf('removeUnusedNS') + 1
      );
      expect(names.indexOf('removeXlink')).to.equal(
        names.indexOf('svgo1PathData') - 1
      );
    });

    it('only uses the listed plugins when `full` is set', () => {
      let config = convertLegacyConfig({
        full: true,
        plugins: [{ removeTitle: true }, { removeDesc: true }],
      });

      expect(config.full).to.equal(undefined);
      expect(pluginNames(config)).to.deep.equal(['removeTitle', 'removeDesc']);
    });

    it('keeps other top-level options', () => {
      let config = convertLegacyConfig({
        multipass: true,
        js2svg: { pretty: true },
      });

      expect(config.multipass).to.equal(true);
      expect(config.js2svg).to.deep.equal({ pretty: true });
    });

    it('adds a last plugin that formats path data like svgo 1', () => {
      let config = convertLegacyConfig({});
      let plugin = config.plugins[config.plugins.length - 1];
      let node = { name: 'path', attributes: { d: 'm1 2 3 4Z' } };

      plugin.fn().element.enter(node);

      expect(plugin.name).to.equal('svgo1PathData');
      expect(node.attributes.d).to.equal('M1 2l3 4z');
    });

    it('leaves out the path data plugin when convertPathData is off', () => {
      let config = convertLegacyConfig({
        plugins: [{ convertPathData: false }],
      });

      expect(pluginNames(config)).to.not.include('svgo1PathData');
    });

    it('does not share params between converted configs', () => {
      let first = convertLegacyConfig({});
      findPlugin(first, 'convertPathData').params.removeUseless = true;
      let second = convertLegacyConfig({});

      expect(
        findPlugin(second, 'convertPathData').params.removeUseless
      ).to.equal(false);
    });

    it('throws on custom svgo 1 plugins', () => {
      let config = {
        plugins: [{ myPlugin: { type: 'perItem', fn: () => {} } }],
      };

      expect(() => convertLegacyConfig(config)).to.throw(
        /custom svgo 1 plugin "myPlugin"/
      );
    });
  });

  describe('formatPathDataLikeSvgo1', () => {
    it('writes the lineto after a moveto', () => {
      expect(formatPathDataLikeSvgo1('M19.947 0 .001 11.5V11')).to.equal(
        'M19.947 0L.001 11.5V11'
      );
      expect(formatPathDataLikeSvgo1('M0 0h1m2 3-1-1 4 5')).to.equal(
        'M0 0h1m2 3l-1-1 4 5'
      );
    });

    it('starts the path with an absolute moveto', () => {
      expect(formatPathDataLikeSvgo1('m-10.98 30.876 51.96-30z')).to.equal(
        'M-10.98 30.876l51.96-30z'
      );
    });

    it('writes closepath as lowercase z', () => {
      expect(formatPathDataLikeSvgo1('M7 6V0H6v6H7ZM1 1h1Z')).to.equal(
        'M7 6V0H6v6H7zM1 1h1z'
      );
    });

    it('leaves a moveto without a following lineto unchanged', () => {
      expect(formatPathDataLikeSvgo1('M1 2V3M4 5h6')).to.equal('M1 2V3M4 5h6');
      expect(formatPathDataLikeSvgo1('M1-2.5.5-1e-3')).to.equal(
        'M1-2.5L.5-1e-3'
      );
    });
  });

  describe('toModernConfig', () => {
    it('passes svgo 4 configs through unchanged', () => {
      let config = { plugins: ['preset-default'], multipass: true };
      expect(toModernConfig(config)).to.equal(config);
    });

    it('converts svgo 1 configs', () => {
      let config = toModernConfig({ plugins: [{ removeTitle: false }] });
      expect(pluginNames(config)).to.not.include('removeTitle');
      expect(pluginNames(config)).to.include('removeDesc');
    });
  });
});
