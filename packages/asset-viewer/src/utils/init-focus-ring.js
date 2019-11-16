/* Only show the focus ring to tabbing users. */

const hasDOM = typeof window !== 'undefined';
const tabKey = 9;

function turnOnIsTabbing({ keyCode }) {
  if (keyCode === tabKey) {
    document.body.classList.add('is-tabbing');
    window.removeEventListener('keydown', turnOnIsTabbing);
    /* eslint-disable-next-line no-use-before-define */
    window.addEventListener('mousedown', turnOffIsTabbing);
  }
}

function turnOffIsTabbing() {
  document.body.classList.remove('is-tabbing');
  window.removeEventListener('mousedown', turnOffIsTabbing);
  window.addEventListener('keydown', turnOnIsTabbing);
}

if (hasDOM) {
  window.addEventListener('keydown', turnOnIsTabbing);
}
