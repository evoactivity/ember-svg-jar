import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | svg-jar', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders correct SVG image', async function (assert) {
    await render(hbs`{{svg-jar "icon" data-test-icon="true"}}`);

    assert.dom('[data-test-icon="true"]').exists();

    const expectedSVG =
      '<svg viewBox="0 0 24 24" height="24" width="24" data-test-icon="true"><circle cx="12" cy="12" r="6" fill="red"></circle></svg>';

    const actualSVG = this.element.querySelector(
      '[data-test-icon="true"]'
    ).outerHTML;

    assert.strictEqual(actualSVG, expectedSVG);
  });

  test('it supports nested assets', async function (assert) {
    await render(hbs`{{svg-jar "images/nested" data-test-icon="true"}}`);
    assert.dom('[data-test-icon="true"]').exists();
  });

  test('it supports IDs with spaces, dots and underscores', async function (assert) {
    await render(hbs`{{svg-jar "dot.  spaced_" data-test-icon="true"}}`);
    assert.dom('[data-test-icon="true"]').exists();
  });

  test('it does not render SVG if the asset ID is wrong', async function (assert) {
    await render(hbs`{{svg-jar "wrong-id" data-test-icon="true"}}`);
    assert.dom('[data-test-icon="true"]').doesNotExist();
  });

  test('it allows to set SVG attributes', async function (assert) {
    await render(
      hbs`{{svg-jar "icon" class="myicon" data-foo="bar" role="img" data-test-icon="true"}}`
    );

    assert
      .dom('[data-test-icon="true"]')
      .hasAttribute('class', 'myicon')
      .hasAttribute('data-foo', 'bar')
      .hasAttribute('role', 'img')
      .doesNotHaveAttribute('aria-labelledby');
  });

  test('it adds SVG accessibility elements', async function (assert) {
    await render(
      hbs`{{svg-jar "icon" class="myicon" title="Green rectangle" desc="A light green rectangle" data-test-icon="true"}}`
    );

    assert.dom('title').hasText('Green rectangle');
    assert.dom('title').hasAttribute('id', 'title');

    assert.dom('desc').hasText('A light green rectangle');
    assert.dom('desc').hasAttribute('id', 'desc');

    assert
      .dom('[data-test-icon="true"]')
      .hasAttribute('class', 'myicon')
      .hasAttribute('aria-labelledby', 'title desc')
      .doesNotHaveAttribute('title')
      .doesNotHaveAttribute('desc');
  });

  test('it allows to set a11y SVG attributes for decorative images', async function (assert) {
    await render(
      hbs`{{svg-jar "icon" role="presentation" data-test-id="one"}}`
    );
    assert.dom('[data-test-id="one"]').hasAttribute('role', 'presentation');

    await render(hbs`{{svg-jar "icon" role="none" data-test-id="two"}}`);
    assert.dom('[data-test-id="two"]').hasAttribute('role', 'none');

    await render(
      hbs`{{svg-jar "icon" aria-hidden="true" data-test-id="three"}}`
    );
    assert.dom('[data-test-id="three"]').hasAttribute('aria-hidden', 'true');
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
    await render(
      hbs`{{svg-jar "icon" title="Green rectangle" data-test-id="one"}}`
    );

    assert
      .dom('[data-test-id="one"]')
      .hasAttribute('viewBox', '0 0 24 24')
      .hasAttribute('height', '24');

    assert.dom('title').hasText('Green rectangle');

    await render(
      hbs`{{svg-jar "icon" viewBox="0 0 50 50" height="50" title="Red circle" data-test-id="two"}}`
    );

    assert
      .dom('[data-test-id="two"]')
      .hasAttribute('viewBox', '0 0 50 50')
      .hasAttribute('height', '50');

    assert.dom('title').hasText('Red circle');
  });

  test('it allows to remove original attributes', async function (assert) {
    await render(hbs`{{svg-jar "icon" data-test-id="one"}}`);
    assert.dom('[data-test-id="one"]').hasAttribute('viewBox');

    await render(hbs`{{svg-jar "icon" viewBox=null data-test-id="two"}}`);
    assert.dom('[data-test-id="two"]').hasNoAttribute('viewBox');
  });

  test('it allows to multiply original width and height with "size" attribute', async function (assert) {
    await render(hbs`{{svg-jar "icon" data-test-id="one"}}`);

    assert
      .dom('[data-test-id="one"]')
      .hasAttribute('height', '24')
      .hasAttribute('width', '24');

    await render(hbs`{{svg-jar "icon" size=2 data-test-id="two"}}`);

    assert
      .dom('[data-test-id="two"]')
      .hasAttribute('height', '48')
      .hasAttribute('width', '48');
  });

  test('it renders correct SVG for symbol strategy', async function (assert) {
    await render(hbs`{{svg-jar "#icon" data-test-id="one"}}`);

    assert
      .dom('[data-test-id="one"] use')
      .exists()
      .hasAttribute('xlink:href', '#icon');
  });

  test('it allows to set SVG attributes for symbol strategy', async function (assert) {
    await render(
      hbs`{{svg-jar "#icon" class="myicon" data-foo="bar" role="img" data-test-id="one"}}`
    );

    assert
      .dom('[data-test-id="one"]')
      .hasAttribute('class', 'myicon')
      .hasAttribute('data-foo', 'bar')
      .hasAttribute('role', 'img')
      .doesNotHaveAttribute('aria-labelledby');
  });

  test('it adds SVG accessibility elements for symbol strategy', async function (assert) {
    await render(
      hbs`{{svg-jar "#icon" class="myicon" title="Green rectangle" desc="A light green rectangle" data-test-id="one"}}`
    );

    assert.dom('title').hasText('Green rectangle');
    assert.dom('title').hasAttribute('id', 'title');

    assert.dom('desc').hasText('A light green rectangle');
    assert.dom('desc').hasAttribute('id', 'desc');

    assert
      .dom('[data-test-id="one"]')
      .hasAttribute('class', 'myicon')
      .hasAttribute('aria-labelledby', 'title desc')
      .doesNotHaveAttribute('title')
      .doesNotHaveAttribute('desc');
  });

  test('it allows to set a11y SVG attributes for decorative images for symbol strategy', async function (assert) {
    await render(
      hbs`{{svg-jar "#icon" role="presentation" data-test-id="one"}}`
    );
    assert.dom('[data-test-id="one"]').hasAttribute('role', 'presentation');

    await render(hbs`{{svg-jar "#icon" role="none" data-test-id="two"}}`);
    assert.dom('[data-test-id="two"]').hasAttribute('role', 'none');

    await render(
      hbs`{{svg-jar "#icon" aria-hidden="true" data-test-id="three"}}`
    );
    assert.dom('[data-test-id="three"]').hasAttribute('aria-hidden', 'true');
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
