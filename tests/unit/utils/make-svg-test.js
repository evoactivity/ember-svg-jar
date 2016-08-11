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
  let originalStore = {
    icon: { content: 'icon', attrs: { class: 'original' } }
  };

  let customAttrs = { class: 'custom' };
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

test('inlineSvgFor sizeFactor', function(assert) {
  let sizeFactor;
  let customAttrs;
  let assetStore = {
    icon: { content: 'icon', attrs: { width: '5px', height: '10px' } }
  };

  customAttrs = {};
  assert.equal(
    inlineSvgFor('icon', {}, assetStore),
    '<svg width="5px" height="10px">icon</svg>',
    "doesn't change height and width if sizeFactor is undefined"
  );

  sizeFactor = 2;
  customAttrs = {};
  assert.equal(
    inlineSvgFor('icon', customAttrs, assetStore, sizeFactor),
    '<svg width="10" height="20">icon</svg>',
    'can double original height and width'
  );

  sizeFactor = 3;
  customAttrs = { height: '1px' };
  assert.equal(
    inlineSvgFor('icon', customAttrs, assetStore, sizeFactor),
    '<svg width="15" height="3">icon</svg>',
    'can triple original width and custom height'
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
