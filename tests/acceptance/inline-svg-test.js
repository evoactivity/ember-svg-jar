import { module, test } from 'qunit';
import { visit, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | inline-svg', function (hooks) {
  setupApplicationTest(hooks);

  test('inline svg is injected to the document', async function (assert) {
    await visit('/');
    assert.dom('.inline-icon > svg').exists();

    let expectedSVG =
      '<svg viewBox="0 0 24 24" height="24" width="24"><circle cx="12" cy="12" r="6" fill="red"></circle></svg>';
    let actualSVG = find('.inline-icon > svg').outerHTML;
    assert.strictEqual(actualSVG, expectedSVG);
  });

  test('inline accessible svg is injected to the document', async function (assert) {
    await visit('/');
    assert.dom('.inline-accessible-icon > svg').exists();

    let expectedSVG =
      '<svg viewBox="0 0 24 24" height="24" width="24" aria-labelledby="title desc"><title id="title">dummy title</title><desc id="desc">dummy dec</desc><circle cx="12" cy="12" r="6" fill="red"></circle></svg>';
    let actualSVG = find('.inline-accessible-icon > svg').outerHTML;
    assert.strictEqual(actualSVG, expectedSVG);
  });
});
