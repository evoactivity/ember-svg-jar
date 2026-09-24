'use strict';

const { EOL } = require('os');

const prefix = '[ember-svg-jar]';

function yellow(text) {
  let useColor = process.stderr.isTTY && !('NO_COLOR' in process.env);
  return useColor ? `\u001b[33m${text}\u001b[39m` : text;
}

module.exports = {
  // Same output as console-ui's writeWarnLine: a yellow "WARNING:" line on
  // stderr, after an empty line.
  warn: message => {
    process.stderr.write(
      `${EOL}${yellow(`WARNING: ${prefix} ${message}`)}${EOL}`
    );
  },

  error: message => {
    throw new Error(`${prefix} ${message}`);
  },
};
