import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | svg jar test');

test('embeds SVGs with svg-jar helper', function(assert) {
  visit('/');

  andThen(function() {
    assert.notOk(find('.inline-undefined svg').length, 'undefined svg id');
    assert.ok(find('.inline-root svg path').length, 'inline root');
    assert.ok(find('.inline-nested svg path').length, 'inline nested');
    assert.ok(find('.inline-with-class svg.helper-class').length, 'inline with class');

    assert.ok(find('.symbol-root svg use').length, 'symbol root');
    assert.ok(find('.symbol-nested svg use').length, 'symbol nested');
    assert.ok(find('.symbol-with-class svg.helper-class').length, 'symbol with class');
  });
});
