import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | svg-jar', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders correct SVG image', async function (assert) {
    await render(hbs`{{svg-jar "icon"}}`);
    assert.dom('svg').exists();

    let expectedSVG =
      '<svg viewBox="0 0 24 24" height="24" width="24"><circle cx="12" cy="12" r="6" fill="red"></circle></svg>';
    let actualSVG = this.element.querySelector('svg').outerHTML;
    assert.strictEqual(actualSVG, expectedSVG);
  });

  test('it supports nested assets', async function (assert) {
    await render(hbs`{{svg-jar "images/nested"}}`);
    assert.dom('svg').exists();
  });

  test('it supports IDs with spaces, dots and underscores', async function (assert) {
    await render(hbs`{{svg-jar "dot.  spaced_"}}`);
    assert.dom('svg').exists();
  });

  test('it does not render SVG if the asset ID is wrong', async function (assert) {
    await render(hbs`{{svg-jar "wrong-id"}}`);
    assert.dom('svg').doesNotExist();
  });

  test('it allows to set SVG attributes', async function (assert) {
    await render(
      hbs`{{svg-jar "icon" class="myicon" data-foo="bar" role="img"}}`
    );
    assert.dom('svg').hasAttribute('class', 'myicon');
    assert.dom('svg').hasAttribute('data-foo', 'bar');
    assert.dom('svg').hasAttribute('role', 'img');
    assert.dom('svg').doesNotHaveAttribute('aria-labelledby');
  });

  test('it adds SVG accessibility elements', async function (assert) {
    await render(
      hbs`{{svg-jar "icon" class="myicon" title="Green rectangle" desc="A light green rectangle"}}`
    );
    assert.dom('title').hasText('Green rectangle');
    assert.dom('title').hasAttribute('id', 'title');

    assert.dom('desc').hasText('A light green rectangle');
    assert.dom('desc').hasAttribute('id', 'desc');

    assert.dom('svg').hasAttribute('class', 'myicon');
    assert.dom('svg').hasAttribute('aria-labelledby', 'title desc');

    assert.dom('svg').doesNotHaveAttribute('title');
    assert.dom('svg').doesNotHaveAttribute('desc');
  });

  test('it allows to set a11y SVG attributes for decorative images', async function (assert) {
    await render(hbs`{{svg-jar "icon" role="presentation"}}`);
    assert.dom('svg').hasAttribute('role', 'presentation');

    await render(hbs`{{svg-jar "icon" role="none"}}`);
    assert.dom('svg').hasAttribute('role', 'none');

    await render(hbs`{{svg-jar "icon" aria-hidden="true"}}`);
    assert.dom('svg').hasAttribute('aria-hidden', 'true');
  });

  test('it escapes html passed into attributes', async function (assert) {
    await render(
      hbs`{{svg-jar "icon" title="<script>alert('evil javascript')</script>" desc="<div>evil string</div>"}}`
    );

    assert.dom('title').hasText("<script>alert('evil javascript')</script>");
    assert.strictEqual(document.querySelector('#title').children.length, 0);

    assert.dom('desc').hasText('<div>evil string</div>');
    assert.strictEqual(document.querySelector('#desc').children.length, 0);
  });

  test('it allows to override original SVG attributes', async function (assert) {
    await render(hbs`{{svg-jar "icon" title="Green rectangle"}}`);
    assert.dom('svg').hasAttribute('viewBox', '0 0 24 24');
    assert.dom('svg').hasAttribute('height', '24');
    assert.dom('title').hasText('Green rectangle');

    await render(
      hbs`{{svg-jar "icon" viewBox="0 0 50 50" height="50" title="Red circle"}}`
    );
    assert.dom('svg').hasAttribute('viewBox', '0 0 50 50');
    assert.dom('svg').hasAttribute('height', '50');
    assert.dom('title').hasText('Red circle');
  });

  test('it allows to remove original attributes', async function (assert) {
    await render(hbs`{{svg-jar "icon"}}`);
    assert.dom('svg').hasAttribute('viewBox');

    await render(hbs`{{svg-jar "icon" viewBox=null}}`);
    assert.dom('svg').hasNoAttribute('viewBox');
  });

  test('it allows to multiply original width and height with "size" attribute', async function (assert) {
    await render(hbs`{{svg-jar "icon"}}`);
    assert.dom('svg').hasAttribute('height', '24');
    assert.dom('svg').hasAttribute('width', '24');

    await render(hbs`{{svg-jar "icon" size=2}}`);
    assert.dom('svg').hasAttribute('height', '48');
    assert.dom('svg').hasAttribute('width', '48');
  });

  test('it renders correct SVG for symbol strategy', async function (assert) {
    await render(hbs`{{svg-jar "#icon"}}`);
    assert.dom('svg use').exists();
    assert.dom('svg use').hasAttribute('xlink:href', '#icon');
  });

  test('it allows to set SVG attributes for symbol strategy', async function (assert) {
    await render(
      hbs`{{svg-jar "#icon" class="myicon" data-foo="bar" role="img"}}`
    );
    assert.dom('svg').hasAttribute('class', 'myicon');
    assert.dom('svg').hasAttribute('data-foo', 'bar');
    assert.dom('svg').hasAttribute('role', 'img');
    assert.dom('svg').doesNotHaveAttribute('aria-labelledby');
  });

  test('it adds SVG accessibility elements for symbol strategy', async function (assert) {
    await render(
      hbs`{{svg-jar "#icon" class="myicon" title="Green rectangle" desc="A light green rectangle"}}`
    );
    assert.dom('title').hasText('Green rectangle');
    assert.dom('title').hasAttribute('id', 'title');

    assert.dom('desc').hasText('A light green rectangle');
    assert.dom('desc').hasAttribute('id', 'desc');

    assert.dom('svg').hasAttribute('class', 'myicon');
    assert.dom('svg').hasAttribute('aria-labelledby', 'title desc');

    assert.dom('svg').doesNotHaveAttribute('title');
    assert.dom('svg').doesNotHaveAttribute('desc');
  });

  test('it allows to set a11y SVG attributes for decorative images for symbol strategy', async function (assert) {
    await render(hbs`{{svg-jar "#icon" role="presentation"}}`);
    assert.dom('svg').hasAttribute('role', 'presentation');

    await render(hbs`{{svg-jar "#icon" role="none"}}`);
    assert.dom('svg').hasAttribute('role', 'none');

    await render(hbs`{{svg-jar "#icon" aria-hidden="true"}}`);
    assert.dom('svg').hasAttribute('aria-hidden', 'true');
  });

  test('it escapes html passed into attributes for symbol strategy', async function (assert) {
    await render(
      hbs`{{svg-jar "#icon" title="<script>alert('evil javascript')</script>" desc="<div>evil string</div>"}}`
    );

    assert.dom('title').hasText("<script>alert('evil javascript')</script>");
    assert.strictEqual(document.querySelector('#title').children.length, 0);

    assert.dom('desc').hasText('<div>evil string</div>');
    assert.strictEqual(document.querySelector('#desc').children.length, 0);
  });
});
