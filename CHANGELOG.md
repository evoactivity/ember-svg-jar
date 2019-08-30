## SVGJar Change Log

### v2.2.1

- [[FIX]](https://github.com/ivanvotti/ember-svg-jar/pull/137) Move development dependencies into `devDependencies` [@Turbo87](https://github.com/Turbo87)

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v2.2.0...v2.2.1)

### v2.2.0
- [ENHANCEMENT] Improved Assets Viewer. It got faster for big SVG collections and has better UI.
- [INTERNAL] Cleanup some code.

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v2.1.0...v2.2.0)

### v2.1.0
- [ENHANCEMENT] Disable `removeTitle`, `removeViewBox`, and `removeDesc` SVGO plugins by default to preserve the original behaviour and stay a zero-configuration addon.
- [INTERNAL] Get rid of `viewer.embed` option.
- [INTERNAL] Improve SVGJar options validation.

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v2.0.0...v2.1.0)

### v2.0.0
- [BREAKING ENHANCEMENT] Upgrade SVGO from `0.6.6` to `1.3.0`. It's a breaking change to fix [security issues of SVGO 0.6.6][reason]. In SVGO `1.3.0` most plugins are now active by default (e.g. `removeTitle`, `removeViewBox`). This can cause undesired changes in optimized SVG images. In `ember-svg-jar` `v2.1.0` it's not the case anymore for `removeTitle`, `removeViewBox`, and `removeDesc` plugins. [Read this document][info] to know what exactly changed. To see changes of default SVGO plugins [check out this diff][diff].
- [CLEANUP] Upgrade ember-cli to `3.11.0`, including related packages

[info]: https://github.com/ivanvotti/broccoli-svg-optimizer/blob/master/docs/0.6.6-to-1.3.0.md
[diff]: https://github.com/ivanvotti/broccoli-svg-optimizer/commit/58057a2cd521160b1eaba058303774f427cdd1f0#diff-e5d4ccd3cd14c513eca40fc7a5f48182
[reason]: https://github.com/ivanvotti/broccoli-svg-optimizer/issues/14

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v1.2.2...v2.0.0)

### v1.2.2
- [[INTERNAL]](https://github.com/ivanvotti/ember-svg-jar/pull/92) Switch from copy to assign [@buschtoens](https://github.com/buschtoens)

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v1.2.1...v1.2.2)

### v1.2.1
- [[INTERNAL]](https://github.com/ivanvotti/ember-svg-jar/pull/77) Switch to ember-copy [@wagenet](https://github.com/wagenet)
- [INTERNAL] Upgrade to ember-cli 3.3.0

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v1.2.0...v1.2.1)

### v1.2.0
- [[internal]](https://github.com/ivanvotti/ember-svg-jar/pull/72) Ability to specify which version of `svgo` to use for optimizer
- [INTERNAL] Drop Node 4 support
- [INTERNAL] Update dependencies & cleanup code

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v1.1.0...v1.2.0)

### v1.1.0
- [[FEATURE]](https://github.com/ivanvotti/ember-svg-jar/pull/64) Add `containerAttrs` option for symbol strategy
- [[CLEANUP]](https://github.com/ivanvotti/ember-svg-jar/pull/63) Use console.warn instead of Ember.Logger [@rwwagner90](https://github.com/rwwagner90)

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v1.0.0...v1.1.0)

### v1.0.0
- [[FEATURE]](https://github.com/ivanvotti/ember-svg-jar/pull/52) ember-svg-jar can now be used by addons as a `dependency` [@ef4](https://github.com/ef4)
- [[FEATURE]](https://github.com/ivanvotti/ember-svg-jar/pull/62) Ability to suppress asset validation warnings
- [CLEANUP] The addon is now fully consumable as a Git dependency, without any build step
- [[CLEANUP]](https://github.com/ivanvotti/ember-svg-jar/pull/53) Upgrade to ember-cli 3.0.0 [@Dhaulagiri](https://github.com/Dhaulagiri)
- [CLEANUP] Making addon compatible with the latest Ember CLI `ember-cli@3.2`
- [[FIX]](https://github.com/ivanvotti/ember-svg-jar/pull/61) Workaround for broccoli-asset-rev bug (fixes [#54](https://github.com/ivanvotti/ember-svg-jar/issues/54))

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.12.0...v1.0.0)

### v0.12.0
- [[ENHANCEMENT]](https://github.com/ivanvotti/ember-svg-jar/pull/50) Adding `tests/dummy/public` to `sourceDirs` for addons [#29](https://github.com/ivanvotti/ember-svg-jar/issues/29) + Ember-CLI 2.17.1 [@rwwagner90](https://github.com/rwwagner90)
- [[CLEANUP]](https://github.com/ivanvotti/ember-svg-jar/pull/48) Fix deprecations [@ryanpatrickcook](https://github.com/ryanpatrickcook)
- [[CLEANUP]](https://github.com/ivanvotti/ember-svg-jar/pull/42) Latest Ember CLI v2.14.1, Chrome Testing, yarn.lock [@alexdiliberto](https://github.com/alexdiliberto)

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.11.0...v0.12.0)

### v0.11.0
- [[FEATURE]](https://github.com/ivanvotti/ember-svg-jar/pull/40) Add basic Windows support

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.10.3...v0.11.0)

### v0.10.3
- [[FEATURE]](https://github.com/ivanvotti/ember-svg-jar/pull/37) Add rootURL option
- [[CLEANUP]](https://github.com/ivanvotti/ember-svg-jar/pull/36) Upgrade to ember-cli 2.13.1 [@john-griffin](https://github.com/john-griffin)

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.10.1...v0.10.3)

### v0.10.1
- [[BUGFIX]](https://github.com/ivanvotti/ember-svg-jar/pull/35) Fix calculating optimizedSvg file size [#32](https://github.com/ivanvotti/ember-svg-jar/issues/32) [@ilucin](https://github.com/ilucin)

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.10.0...v0.10.1)

### v0.10.0
- [[CLEANUP]](https://github.com/ivanvotti/ember-svg-jar/pull/30) Fix treeForAddon deprecation warning #27 [@ef4](https://github.com/ef4)
- [[BUGFIX]](https://github.com/ivanvotti/ember-svg-jar/pull/21) Fix a problem with .DS_Store #20 [@mupkoo](https://github.com/mupkoo)
- [CLEANUP] Upgrade ember-cli to 2.12.1 and related packages
- [CLEANUP] Refactor node.js related modules

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.9.3...v0.10.0)

### v0.9.3
- [INTERNAL] The viewer builder skips emtpy SVG
- [INTERNAL] Upgrade broccoli-svg-optimizer

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.9.2...v0.9.3)

### v0.9.2
- [[ENHANCEMENT]](https://github.com/ivanvotti/ember-svg-jar/pull/16) Ability to import `svgJar` helper to use outside of templates [@djsegal](https://github.com/djsegal)
- [CLEANUP] Refactor helper's code and tests

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.9.1...v0.9.2)

### v0.9.1
- [[FEATURE]](https://github.com/ivanvotti/ember-svg-jar/pull/13) Helper supports `size` attribute `{{svg-jar "asset-name" size=2}}`
- [ENHANCEMENT] The viewer now shows asset base size as `24x20px` in details
- [ENHANCEMENT] The viewer allows to copy optimized asset code to clipboard
- [CLEANUP] Add node tests to cover all broccoli stuff & improve code

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.9.0...v0.9.1)

### v0.9.0
- [FEATURE] The viewer allows downloading selected assets
- [FEATURE] The viewer allows copying selected assets' code to the clipboard
- [FEATURE] The viewer now shows original and optimized file sizes
- [BREAKING ENHANCEMENT] `stripPath` is now `true` by default

This release contains a potentially breaking change. In previous versions of the addon `stripPath` was set to `false` by default. It means that some of your asset IDs could look like `{{svg-jar "icons/filled/twitter"}}`. When `stripPath` is `true` the same helper will look like this `{{svg-jar "twitter"}}`.

If you prefer the old behavior, just add the code below to the `ember-cli-build.js`:

```javascript
let app = new EmberApp(defaults, {
  svgJar: {
    stripPath: false
  }
});
```

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.8.3...v0.9.0)

### v0.8.3
- [BUGFIX] Custom helper attrs shouldn't affect the inline assets store
- [DOC] Add CHANGELOG.md

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.8.2...v0.8.3)

### v0.8.2
- [FEATURE] `svg-jar` helper can now bind any passed attributes to created SVG elements
- [CLEANUP] Upgrade ember-cli to 2.7.0
- [CLEANUP] Add more tests & clean up the helper's code

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.8.1...v0.8.2)

### v0.8.1
- [BUGFIX] The viewer correctly shows SVGs with undefined height & width

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.8.0...v0.8.1)

### v0.8.0
- [FEATURE] Add support for old Ember versions
- [ENHANCEMENT] Add sidebar links to the viewer

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.7.0...v0.8.0)

### v0.7.0
- [ENHANCEMENT] Apply stripPath before idGen
- [CLEANUP] Unify access to strategy specific options
- [DOC] Add documentation for all configuration options

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.6.1...v0.7.0)

### v0.6.1
- [CLEANUP] Add acceptance tests
- [DOC] Improve readme

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.6.0...v0.6.1)

### v0.6.0
- [CLEANUP] Improve assets validation
- [CLEANUP] Switch to ES6 for broccoli modules
- [CLEANUP] Add ESLint and cleanup the code
- [CLEANUP] Remove compiled files of the viewer from the repo
- [INTERNAL] Upgrade broccoli-symbolizer

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.5.0...v0.6.0)

### v0.5.0
- [FEATURE] Add stripPath option
- [FEATURE] Add assets validation to ensure unique asset IDs
- [FEATURE] Make the `optimizer` a strategy specific option
- [ENHANCEMENT] Strip `.svg` extension by default
- [ENHANCEMENT] Allow the dot character `.` in inline strategy IDs

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.4.2...v0.5.0)

### v0.4.2 - v0.1.0

[Full changelog](https://github.com/ivanvotti/ember-svg-jar/compare/v0.1.0...v0.4.2)
