import { copy } from 'ember-metal/utils';
import { module, test } from 'qunit';
import makeSvg, {
  formatAttrs,
  inlineSvgFor,
  symbolUseFor
} from 'ember-svg-jar/utils/make-svg';

module('Unit | Utility | make svg');

test('makeSvg works', function(assert) {
  let customAttrs = {};
  let result = makeSvg('#test', customAttrs);
  assert.equal(result, '<svg ><use xlink:href="#test" /></svg>');
});

test('symbolUseFor works', function(assert) {
  let customAttrs = {};
  let result = symbolUseFor('#test', customAttrs);
  assert.equal(result, '<svg ><use xlink:href="#test" /></svg>');
});

test('inlineSvgFor with original attrs', function(assert) {
  let customAttrs = {};
  let assetStore = {
    'with-attrs': { content: 'with-attrs content', attrs: { class: 'foo' } },
    'no-attrs': { content: 'no-attrs content' }
  };

  assert.equal(
    inlineSvgFor('with-attrs', customAttrs, assetStore),
    '<svg class="foo">with-attrs content</svg>',
    'with original attrs'
  );

  assert.equal(
    inlineSvgFor('no-attrs', customAttrs, assetStore),
    '<svg >no-attrs content</svg>',
    'with undefined original attrs'
  );
});

test('inlineSvgFor with custom attrs', function(assert) {
  let customAttrs = { class: 'custom' };
  let originalStore = {
    icon: { content: 'icon', attrs: { class: 'original' } }
  };

  let passedStore = copy(originalStore, true);
  assert.equal(
    inlineSvgFor('icon', customAttrs, passedStore),
    '<svg class="custom">icon</svg>',
    'can rewrite original attrs'
  );

  assert.deepEqual(originalStore, passedStore,
    'does not change the assetStore objects'
  );
});

test('formatAttrs works', function(assert) {
  let result = formatAttrs({
    attrName: 'attrValue',
    'f:oo': 'bar',
    isnull: null,
    isundefined: undefined
  });
  assert.equal(result, 'attrName="attrValue" f:oo="bar"');
});
