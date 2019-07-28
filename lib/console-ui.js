'use strict';

const UI = require('console-ui');

const ui = new UI({
  inputStream: process.stdin,
  outputStream: process.stdout,
  errorStream: process.stderr
});

const prefix = '[ember-svg-jar]';

module.exports = {
  warn: (message) => {
    ui.write('\n');
    ui.writeWarnLine(`${prefix} ${message}`);
  },

  error: (message) => {
    throw new Error(`${prefix} ${message}`);
  }
};
