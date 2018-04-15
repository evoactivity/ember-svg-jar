import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | symbols loader', function(hooks) {
  setupApplicationTest(hooks);

  test('symbols are injected to the document', async function(assert) {
    await visit('/');
    assert.dom('svg', this.element.ownerDocument).exists();

    const expectedSVG = `<svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<symbol id="dot.--spaced_" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="red"></circle></symbol>
<symbol id="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="red"></circle></symbol>
<symbol id="images/nested" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="red"></circle></symbol>
</svg>`;
    const actualSVG = this.element.ownerDocument.querySelector('svg').outerHTML;
    assert.equal(actualSVG, expectedSVG);
  });
});
