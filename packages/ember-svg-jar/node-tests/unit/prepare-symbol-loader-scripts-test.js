const { expect } = require('chai');
const prepareScript = require('../../lib/prepare-symbol-loader-script');

describe('prepare-symbol-loader-script', function () {
  it('injects rootURL at target file', function () {
    const script = prepareScript('/', 'foo.html', false);
    expect(script).to.include('/foo.html');
  });

  it('when running in test environment', function () {
    const script = prepareScript('/', 'foo.html', true);
    expect(script).to.include("querySelector('#ember-testing')");
  });

  it('when not running in test environment', function () {
    const script = prepareScript('/', 'foo.html', false);
    expect(script).to.include("querySelector('body')");
  });
});
