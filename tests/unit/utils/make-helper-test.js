import makeHelper from 'ember-svg-jar/utils/make-helper';
import { module, test } from 'qunit';

module('Unit | Utility | make helper', function () {
  test('it works', function (assert) {
    let result = makeHelper();
    assert.ok(result);
  });
});
