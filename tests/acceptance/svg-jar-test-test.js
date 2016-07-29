import $ from 'jquery';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | svg-jar helper');

test('embeds SVGs with inline strategy', function(assert) {
  visit('/inline-strategy');

  andThen(function() {
    let $unknownWrap = find('.unknown-wrap');
    assert.equal($unknownWrap.length, 1, 'unknown-wrap exists');
    assert.equal($unknownWrap.find('svg').length, 0,
      'unknown-wrap is empty');

    assert.equal(find('.root-wrap svg').length, 1,
      'root svg is rendered');

    assert.equal(find('.dot-spaced-wrap svg').length, 1,
      'dot-spaced svg is rendered');

    assert.equal(find('.nested-wrap svg').length, 1,
      'nested svg is rendered');

    let originalSVG = find('.original-wrap svg')[0];
    assert.equal(originalSVG.getAttribute('viewBox'), '0 0 13 13',
      'original SVG has correct viewBox attribute');
    assert.equal(originalSVG.getAttribute('width'), '13',
      'original SVG has correct width attribute');

    let customSVG = find('.custom-wrap svg')[0];
    assert.equal(customSVG.getAttribute('class'), 'custom-class',
      'can set class attribute');
    assert.equal(customSVG.getAttribute('foo'), 'foo',
      'can set foo attribute');
    assert.equal(customSVG.getAttribute('viewBox'), '0 0 234 234',
      'can rewrite viewBox attribute');
    assert.equal(customSVG.getAttribute('width'), null,
      'can remove original width attribute');
  });
});

test('embeds SVGs with symbol strategy', function(assert) {
  visit('/symbol-strategy');

  andThen(function() {
    assert.equal($('symbol#root').length, 1,
      'root symbol exists');
    assert.equal(find('.root-wrap svg use').attr('xlink:href'), '#root',
      'root svg-use has correct ID');

    assert.equal($('symbol#dot\\.--spaced_').length, 1,
      'dot-spaced symbol exists');
    assert.equal(find('.dot-spaced-wrap svg use').attr('xlink:href'), '#dot.--spaced_',
      'dot-spaced svg-use has correct ID');

    assert.equal($('symbol#images\\/nested').length, 1,
      'nested symbol exists');
    assert.equal(find('.nested-wrap svg use').attr('xlink:href'), '#images/nested',
      'nested svg-use has correct ID');

    let originalSVG = find('.original-wrap svg')[0];
    assert.equal(originalSVG.getAttribute('viewBox'), null,
      'original SVG has correct viewBox attribute');
    assert.equal(originalSVG.getAttribute('width'), null,
      'original SVG has correct width attribute');

    let customSVG = find('.custom-wrap svg')[0];
    assert.equal(customSVG.getAttribute('class'), 'custom-class',
      'can set class attribute');
    assert.equal(customSVG.getAttribute('foo'), 'foo',
      'can set foo attribute');
    assert.equal(customSVG.getAttribute('viewBox'), '0 0 234 234',
      'can rewrite viewBox attribute');
    assert.equal(customSVG.getAttribute('width'), null,
      'can remove original width attribute');
  });
});
