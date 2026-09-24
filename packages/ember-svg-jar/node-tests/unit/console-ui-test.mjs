import { EOL } from 'os';
import { stripVTControlCharacters } from 'util';
import * as chai from 'chai';
import consoleUI from '../../lib/console-ui.js';

const { expect } = chai;

describe('console-ui', function () {
  let originalWrite;
  let written;

  beforeEach(function () {
    written = '';
    originalWrite = process.stderr.write;
    process.stderr.write = chunk => {
      written += chunk;
      return true;
    };
  });

  afterEach(function () {
    process.stderr.write = originalWrite;
  });

  it('writes a warning line to stderr after an empty line', function () {
    consoleUI.warn('something is off');

    expect(stripVTControlCharacters(written)).to.equal(
      `${EOL}WARNING: [ember-svg-jar] something is off${EOL}`
    );
  });

  it('throws errors with the addon prefix', function () {
    expect(() => consoleUI.error('bad option')).to.throw(
      '[ember-svg-jar] bad option'
    );
  });
});
