import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | symbols loader', function (hooks) {
  setupApplicationTest(hooks);

  test('symbols are injected to the document', async function (assert) {
    await visit('/');
    assert.dom('svg', this.element.ownerDocument).exists();

    let expectedSVG =
      '<svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient-a"><stop stop-color="#FBA5A4" offset="0%"></stop><stop stop-color="#F66C6B" offset="100%"></stop></linearGradient><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient-b"><stop stop-color="#FFDF74" offset="0%"></stop><stop stop-color="#FFBC40" offset="80%"></stop></linearGradient><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient-c"><stop stop-color="#7ED4FD" offset="0%"></stop><stop stop-color="#48A9F9" offset="80%"></stop></linearGradient><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient-d"><stop stop-color="#ABB2FF" offset="0%"></stop><stop stop-color="#7E85FF" offset="100%"></stop></linearGradient><path d="M34.35 8.667A11.002 11.002 0 0142 19.147v29.575a7 7 0 01-5.096 6.736c-5.214 1.474-10.473 2.21-15.78 2.21-5.334 0-10.67-.744-16.006-2.234A7 7 0 010 48.692V19.175c0-4.927 3.245-9.116 7.741-10.508H5a1 1 0 01-1-1V1a1 1 0 011-1h32a1 1 0 011 1v6.667a1 1 0 01-1 1h-2.65z" id="path-a"></path><mask id="path-b" fill="#fff"><use xlink:href="#a"></use></mask></defs><symbol id="path" viewBox="0 0 125 120"><g transform="translate(44 17)" fill="none" fill-rule="evenodd"><g mask="url(#path-b)"><path fill="#329FF9" d="M-10.98 30.876l51.96-30 6 10.392-51.96 30z"></path><path fill="#666EFF" d="M-23.98 8.359l51.96-30 11 19.053-51.96 30z"></path><path fill="#FFB733" d="M-5.579 46.232l54.56-31.5 6 10.392-54.56 31.5z"></path><path fill="#F66362" d="M5.02 58.588l51.96-30 11 19.053-51.96 30z"></path></g></g></symbol><symbol id="images/nested" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="red"></circle></symbol><symbol id="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="red"></circle></symbol><symbol id="gradient" viewBox="0 0 24 32"><g fill="none"><path d="M24.001 20.594v3.914a7 7 0 01-5.802 6.897 39.22 39.22 0 01-6.72.595c-1.92 0-3.794-.152-5.623-.455a7.055 7.055 0 01-.601-.127L24 20.594h.001z" fill="url(#gradient-a)" transform="translate(-.001)"></path><path d="M24.001 11v7.046L2.834 30.266a6.998 6.998 0 01-2.833-5.627v-.381l23.972-13.84c.019.191.028.386.028.582z" fill="url(#gradient-b)" transform="translate(-.001)"></path><path d="M22.001 1.362V4a1 1 0 01-1 1h-3a6 6 0 015.329 3.24L0 21.71v-7.645L22.001 1.362z" fill="url(#gradient-c)" transform="translate(-.001)"></path><path d="M19.947 0L.001 11.517V11a6 6 0 016-6h-3a1 1 0 01-1-1V1a1 1 0 011-1h16.947-.001z" fill="url(#gradient-d)" transform="translate(-.001)"></path></g></symbol><symbol id="dot.--spaced_" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="red"></circle></symbol></svg>';
    let actualSVG = this.element.ownerDocument.querySelector('svg').outerHTML;
    assert.strictEqual(actualSVG, expectedSVG);
  });
});
