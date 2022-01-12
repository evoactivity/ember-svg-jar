import { module, test } from 'qunit';
import makeSvg, {
  formatAttrs,
  inlineSvgFor,
  symbolUseFor,
  createAriaLabel,
  createAccessibilityElements,
  sanitizeAttrs,
} from 'ember-svg-jar/utils/make-svg';

module('Unit | Utility | make svg', function () {
  test('makeSvg works', function (assert) {
    assert.strictEqual(
      makeSvg('#test').toString(),
      '<svg ><use xlink:href="#test" /></svg>'
    );
  });

  test('makeSvg does not throw error when assetId is `undefined` or `null`', function (assert) {
    assert.notOk(makeSvg());
  });

  test('symbolUseFor works', function (assert) {
    assert.strictEqual(
      symbolUseFor('#test'),
      '<svg ><use xlink:href="#test" /></svg>'
    );
  });

  test('inlineSvgFor with original attrs', function (assert) {
    function assetStore(id) {
      return {
        'with-attrs': {
          content: 'with-attrs content',
          attrs: { class: 'foo' },
        },
        'no-attrs': { content: 'no-attrs content' },
      }[id];
    }

    assert.strictEqual(
      inlineSvgFor('with-attrs', assetStore),
      '<svg class="foo">with-attrs content</svg>',
      'with original attrs'
    );

    assert.strictEqual(
      inlineSvgFor('no-attrs', assetStore),
      '<svg >no-attrs content</svg>',
      'with undefined original attrs'
    );
  });

  test('inlineSvgFor with custom attrs', function (assert) {
    function assetStore(id) {
      return {
        icon: { content: 'icon', attrs: { class: 'original' } },
      }[id];
    }

    let customAttrs = { class: 'custom' };
    assert.strictEqual(
      inlineSvgFor('icon', assetStore, customAttrs),
      '<svg class="custom">icon</svg>',
      'can rewrite original attrs'
    );
  });

  test('inlineSvgFor with size attr', function (assert) {
    let customAttrs;
    function assetStore(id) {
      return {
        icon: { content: 'icon', attrs: { width: '5px', height: '10px' } },
      }[id];
    }

    assert.strictEqual(
      inlineSvgFor('icon', assetStore),
      '<svg width="5px" height="10px">icon</svg>',
      "doesn't change height and width if sizeFactor is undefined"
    );

    customAttrs = { size: 2 };
    assert.strictEqual(
      inlineSvgFor('icon', assetStore, customAttrs),
      '<svg width="10" height="20">icon</svg>',
      'can double original height and width'
    );

    customAttrs = { height: '1px', size: 3 };
    assert.strictEqual(
      inlineSvgFor('icon', assetStore, customAttrs),
      '<svg width="15" height="3">icon</svg>',
      'can triple original width and custom height'
    );
  });

  test('formatAttrs works', function (assert) {
    let result = formatAttrs({
      attrName: 'attrValue',
      'f:oo': 'bar',
      isnull: null,
      isundefined: undefined,
      title: 'Title',
    });
    assert.strictEqual(result, 'attrName="attrValue" f:oo="bar"');
  });

  test('createAriaLabel works', function (assert) {
    let result = createAriaLabel({
      title: 'Title',
      desc: 'This is the title',
    });
    assert.strictEqual(result, 'aria-labelledby="title desc"');

    result = createAriaLabel({});
    assert.strictEqual(result, '');
  });

  test('createAccessibilityElements works', function (assert) {
    let result = createAccessibilityElements({
      title: 'Title',
      desc: 'This is the title',
    });
    assert.strictEqual(
      result,
      '<title id="title">Title</title><desc id="desc">This is the title</desc>'
    );
  });

  test('createAccessibilityElements works with just one element', function (assert) {
    let result = createAccessibilityElements({
      title: 'Title',
    });
    assert.strictEqual(result, '<title id="title">Title</title>');
  });

  test('sanitizeAttrs works', function (assert) {
    let result = sanitizeAttrs({
      title: '<script>Title</script>',
      desc: '<div>This is the title</div>',
    });
    assert.deepEqual(result, {
      title: '&lt;script&gt;Title&lt;/script&gt;',
      desc: '&lt;div&gt;This is the title&lt;/div&gt;',
    });
  });
});
