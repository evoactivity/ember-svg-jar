import fixture from 'broccoli-fixture';
import { fileURLToPath } from 'node:url';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import SVGOptimizer from '../index.js';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('broccoli-svg-optimizer with svgo 2 and later', () => {
  let inputNode = fileURLToPath(new URL('fixtures/index', import.meta.url));

  it('accepts an svgo 4 config', () => {
    let options = {
      svgoConfig: {
        plugins: [
          'preset-default',
          { name: 'removeDesc', params: { removeAny: true } },
        ],
      },
      persist: false,
    };
    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));

    // preset-default in svgo 4 keeps <title> and removes the Z it does
    // not need.
    return expect(outputNode).to.eventually.deep.equal({
      'test.svg':
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13">' +
        '<title>SVG title</title>' +
        '<path d="M7 6V0H6v6H0v1h6v6h1V7h6V6z"/></svg>',
    });
  });

  it('calls optimize on a module object with the config and path', () => {
    let calls = [];
    let svgoModule = {
      optimize(svg, config) {
        calls.push(config);
        return { data: 'module result' };
      },
    };
    let options = {
      svgoConfig: { plugins: ['preset-default'] },
      svgoModule,
      persist: false,
    };
    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));

    return expect(outputNode)
      .to.eventually.deep.equal({ 'test.svg': 'module result' })
      .then(() => {
        expect(calls).to.deep.equal([
          { plugins: ['preset-default'], path: 'test.svg' },
        ]);
      });
  });

  it('converts an svgo 1 config for a module object', () => {
    let calls = [];
    let svgoModule = {
      optimize(svg, config) {
        calls.push(config);
        return { data: 'module result' };
      },
    };
    let options = {
      svgoConfig: { plugins: [{ removeTitle: false }] },
      svgoModule,
      persist: false,
    };
    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));

    return expect(outputNode)
      .to.eventually.deep.equal({ 'test.svg': 'module result' })
      .then(() => {
        let names = calls[0].plugins.map(plugin => plugin.name);
        expect(names).to.include('removeDesc');
        expect(names).to.not.include('removeTitle');
      });
  });

  it('rejects when optimize returns an error, as svgo 2 does', () => {
    let svgoModule = {
      optimize() {
        return { error: 'svgo 2 error' };
      },
    };
    let options = { svgoConfig: {}, svgoModule, persist: false };
    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));

    return expect(outputNode).to.be.rejectedWith('svgo 2 error');
  });

  it('rejects when optimize throws, as svgo 3 and 4 do', () => {
    let svgoModule = {
      optimize() {
        throw new Error('svgo 4 error');
      },
    };
    let options = { svgoConfig: {}, svgoModule, persist: false };
    let outputNode = fixture.build(new SVGOptimizer(inputNode, options));

    return expect(outputNode).to.be.rejectedWith('svgo 4 error');
  });
});
