'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

// Embroider 3 reads dist/ember-template-compiler.js, which ember-source 7 no
// longer ships, so the Embroider scenarios run on the latest Ember 6 LTS.
function onEmber6(scenario) {
  scenario.npm.devDependencies['ember-source'] = '~6.12.0';
  return scenario;
}

module.exports = async function () {
  return {
    packageManager: 'pnpm',
    scenarios: [
      {
        name: 'ember-lts-3.28',
        npm: {
          devDependencies: {
            // Ember 3.28 needs the ember-cli and test packages that support it.
            '@ember/test-helpers': '^2.9.6',
            '@glimmer/component': '^1.1.2',
            'ember-cli': '~4.12.3',
            'ember-cli-fastboot': '^4.1.5',
            'ember-cli-fastboot-testing': '^0.6.2',
            'ember-load-initializers': '^2.1.2',
            'ember-qunit': '^6.2.0',
            'ember-resolver': '^10.1.1',
            'ember-source': '~3.28.12',
          },
        },
      },
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.4',
          },
        },
      },
      {
        name: 'ember-lts-5.12',
        npm: {
          devDependencies: {
            'ember-source': '~5.12.0',
          },
        },
      },
      {
        name: 'ember-lts-6.8',
        npm: {
          devDependencies: {
            'ember-source': '~6.8.4',
          },
        },
      },
      {
        name: 'ember-lts-6.12',
        npm: {
          devDependencies: {
            'ember-source': '~6.12.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
          },
        },
      },
      onEmber6(embroiderSafe()),
      onEmber6(embroiderOptimized()),
    ],
  };
};
