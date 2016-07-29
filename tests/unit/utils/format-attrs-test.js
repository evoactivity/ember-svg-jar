import formatAttrs from 'ember-svg-jar/utils/format-attrs';
import { module, test } from 'qunit';

module('Unit | Utility | format attrs');

test('it works', function(assert) {
  let result = formatAttrs({ attrName: 'attrValue', 'f:oo': 'bar' });
  assert.equal(result, 'attrName="attrValue" f:oo="bar"');
});
