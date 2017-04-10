## SVGJar Change Log

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
