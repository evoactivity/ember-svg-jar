# SVG Fingerprinting

With the default ember-svg-jar configurations SVGs are placed in `public/assets`, they are then compiled into the JS or HTML rather than served individually. The default Ember CLI behaviour is to copy files from `public/assets` into `dist/assets`, and SVGs are not fingerprinted.

Frequently, when deploying far-future http expiry headers are set on all assets in `dist/assets` under the assumption that they're fingerprinted. This means the cached version is always used and if the file is updated then the fingerprint changes and a new version is used.

These two behaviours combined while not correct does not cause any problems in practice as the SVGs are not used directly in production. To correct this you can instruct Ember CLI to fingerprint SVGs by adding the following configuration to your `ember-cli-build.js`:

```javascript
    ...
    new EmberApp(defaults, {
        ...
        fingerprint: {
            extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg', 'ttf', 'woff', 'woff2'],
        },
    });
    ...
```