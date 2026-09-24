import { expect } from 'chai';
import prepareScript from '../../lib/prepare-symbol-loader-script.js';

describe('prepare-symbol-loader-script request mode', function () {
  it('loads symbols synchronously in the test environment', function () {
    const script = prepareScript('/', 'foo.svg', true);
    expect(script).to.include("ajax.open('GET', '/foo.svg', false);");
  });

  it('loads symbols asynchronously outside the test environment', function () {
    const script = prepareScript('/', 'foo.svg', false);
    expect(script).to.include("ajax.open('GET', '/foo.svg', true);");
  });

  it('fills in every placeholder', function () {
    const script = prepareScript('/', 'foo.svg', true);
    expect(script).to.not.include('{{');
  });

  it('assigns onload before sending the request', function () {
    const script = prepareScript('/', 'foo.svg', true);
    expect(script.indexOf('ajax.onload')).to.be.below(
      script.indexOf('ajax.send()')
    );
  });
});
