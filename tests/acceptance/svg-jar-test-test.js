import { find, findAll } from 'ember-native-dom-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';
import $ from 'jquery';

module('Acceptance | svg-jar helper', function(hooks) {
  setupApplicationTest(hooks);

  test('embeds SVGs with inline strategy', async function(assert) {
    await visit('/inline-strategy');

    const $unknownWrap = findAll('.unknown-wrap');
    assert.equal($unknownWrap.length, 1, 'unknown-wrap exists');
    assert.equal(findAll('.unknown-wrap svg').length, 0,
      'unknown-wrap is empty');

    assert.equal(findAll('.root-wrap svg').length, 1,
      'root svg is rendered');

    assert.equal(findAll('.dot-spaced-wrap svg').length, 1,
      'dot-spaced svg is rendered');

    assert.equal(findAll('.nested-wrap svg').length, 1,
      'nested svg is rendered');

    assert.equal(find('.original-wrap svg').getAttribute('viewBox'), '0 0 13 13',
      'original SVG has correct viewBox attribute');
    assert.equal(find('.original-wrap svg').getAttribute('width'), '13',
      'original SVG has correct width attribute');

    assert.equal(find('.custom-wrap svg').getAttribute('class'), 'custom-class',
      'can set class attribute');
    assert.equal(find('.custom-wrap svg').getAttribute('foo'), 'foo',
      'can set foo attribute');
    assert.equal(find('.custom-wrap svg').getAttribute('viewBox'), '0 0 234 234',
      'can rewrite viewBox attribute');
    assert.equal(find('.custom-wrap svg').getAttribute('width'), null,
      'can remove original width attribute');

    assert.equal(find('.double-custom-size-wrap svg').getAttribute('width'), '20',
      'can double custom width via size attribute');
    assert.equal(find('.double-custom-size-wrap svg').getAttribute('height'), '26',
      'can double original height via size attribute');

    assert.equal(find('.triple-original-size-wrap svg').getAttribute('width'), '39',
      'can triple original width via size attribute');
    assert.equal(find('.triple-original-size-wrap svg').getAttribute('height'), '39',
      'can triple original height via size attribute');
  });

  test('embeds SVGs with symbol strategy', async function(assert) {
    await visit('/symbol-strategy');

    assert.equal($('symbol#root').length, 1, 'root symbol exists');
    assert.equal(find('.root-wrap svg use').getAttribute('xlink:href'), '#root',
      'root svg-use has correct ID');

    assert.equal($('symbol#dot\\.--spaced_').length, 1,
      'dot-spaced symbol exists');
    assert.equal(find('.dot-spaced-wrap svg use').getAttribute('xlink:href'), '#dot.--spaced_',
      'dot-spaced svg-use has correct ID');

    assert.equal($('symbol#images\\/nested').length, 1, 'nested symbol exists');
    assert.equal(find('.nested-wrap svg use').getAttribute('xlink:href'), '#images/nested',
      'nested svg-use has correct ID');

    assert.equal(find('.original-wrap svg').getAttribute('viewBox'), null,
      'original SVG has correct viewBox attribute');
    assert.equal(find('.original-wrap svg').getAttribute('width'), null,
      'original SVG has correct width attribute');

    assert.equal(find('.custom-wrap svg').getAttribute('class'), 'custom-class',
      'can set class attribute');
    assert.equal(find('.custom-wrap svg').getAttribute('foo'), 'foo',
      'can set foo attribute');
    assert.equal(find('.custom-wrap svg').getAttribute('viewBox'), '0 0 234 234',
      'can rewrite viewBox attribute');
    assert.equal(find('.custom-wrap svg').getAttribute('width'), null,
      'can remove original width attribute');
  });
});
