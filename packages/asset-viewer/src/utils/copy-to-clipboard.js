function selectAndCopy(element) {
  const previousFocus = document.activeElement;
  let isSucceeded = false;

  try {
    element.select();
    isSucceeded = document.execCommand('copy');

    if (previousFocus) {
      previousFocus.focus();
    }
  } catch (err) {
    // pass
  }

  return isSucceeded;
}

export default function copyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');

  // Prevent zooming on iOS
  textArea.style.fontSize = '12pt';

  // Reset box model
  textArea.style.border = '0';
  textArea.style.padding = '0';
  textArea.style.margin = '0';

  // Move it out of screen
  textArea.style.position = 'absolute';
  textArea.style.right = '-9999px';

  document.body.appendChild(textArea);
  const isSucceeded = selectAndCopy(textArea);
  document.body.removeChild(textArea);

  return isSucceeded;
}
