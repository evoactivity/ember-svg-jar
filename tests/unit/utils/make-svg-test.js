import { module, test } from 'qunit';
import makeSvg, {
  formatAttrs,
  inlineSvgFor,
  symbolUseFor
} from 'ember-svg-jar/utils/make-svg';

module('Unit | Utility | make svg', function() {
  test('makeSvg works', function(assert) {
    assert.equal(makeSvg('#test'), '<svg ><use xlink:href="#test" /></svg>');
  });

  test('symbolUseFor works', function(assert) {
    assert.equal(symbolUseFor('#test'), '<svg ><use xlink:href="#test" /></svg>');
  });

  test('inlineSvgFor with original attrs', function(assert) {
    function assetStore(id) {
      return {
        'with-attrs': { content: 'with-attrs content', attrs: { class: 'foo' } },
        'no-attrs': { content: 'no-attrs content' }
      }[id];
    }

    assert.equal(
      inlineSvgFor('with-attrs', assetStore),
      '<svg class="foo">with-attrs content</svg>',
      'with original attrs'
    );

    assert.equal(
      inlineSvgFor('no-attrs', assetStore),
      '<svg >no-attrs content</svg>',
      'with undefined original attrs'
    );
  });

  test('inlineSvgFor with custom attrs', function(assert) {
    function assetStore(id) {
      return {
        icon: { content: 'icon', attrs: { class: 'original' } }
      }[id];
    }

    const customAttrs = { class: 'custom' };
    assert.equal(
      inlineSvgFor('icon', assetStore, customAttrs),
      '<svg class="custom">icon</svg>',
      'can rewrite original attrs'
    );
  });

  test('inlineSvgFor with size attr', function(assert) {
    let customAttrs;
    function assetStore(id) {
      return {
        icon: { content: 'icon', attrs: { width: '5px', height: '10px' } }
      }[id];
    }

    assert.equal(
      inlineSvgFor('icon', assetStore),
      '<svg width="5px" height="10px">icon</svg>',
      "doesn't change height and width if sizeFactor is undefined"
    );

    customAttrs = { size: 2 };
    assert.equal(
      inlineSvgFor('icon', assetStore, customAttrs),
      '<svg width="10" height="20">icon</svg>',
      'can double original height and width'
    );

    customAttrs = { height: '1px', size: 3 };
    assert.equal(
      inlineSvgFor('icon', assetStore, customAttrs),
      '<svg width="15" height="3">icon</svg>',
      'can triple original width and custom height'
    );
  });

  test('formatAttrs works', function(assert) {
    const result = formatAttrs({
      attrName: 'attrValue',
      'f:oo': 'bar',
      isnull: null,
      isundefined: undefined
    });
    assert.equal(result, 'attrName="attrValue" f:oo="bar"');
  });
});
