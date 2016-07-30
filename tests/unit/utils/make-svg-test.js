import { module, test } from 'qunit';
import makeSvg, {
  formatAttrs,
  inlineSvgFor,
  symbolUseFor
} from 'ember-svg-jar/utils/make-svg';

module('Unit | Utility | make svg');

test('makeSvg works', function(assert) {
  let svgAttrs = {};
  let result = makeSvg('#test', svgAttrs);
  assert.equal(result, '<svg ><use xlink:href="#test" /></svg>');
});

test('symbolUseFor works', function(assert) {
  let svgAttrs = {};
  let result = symbolUseFor('#test', svgAttrs);
  assert.equal(result, '<svg ><use xlink:href="#test" /></svg>');
});

test('inlineSvgFor works', function(assert) {
  let svgAttrs = {};
  let inlineStore = {
    'with-attrs': { content: 'with-attrs content', attrs: { class: 'foo' } },
    'no-attrs': { content: 'no-attrs content' }
  };

  assert.equal(
    inlineSvgFor('with-attrs', svgAttrs, inlineStore),
    '<svg class="foo">with-attrs content</svg>',
    'with original attrs'
  );

  assert.equal(
    inlineSvgFor('no-attrs', svgAttrs, inlineStore),
    '<svg >no-attrs content</svg>',
    'without original attrs'
  );
});

test('formatAttrs works', function(assert) {
  let result = formatAttrs({ attrName: 'attrValue', 'f:oo': 'bar' });
  assert.equal(result, 'attrName="attrValue" f:oo="bar"');
});
