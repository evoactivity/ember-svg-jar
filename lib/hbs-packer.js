'use strict';

const fs = require('fs');
const path = require('path-posix');
const CachingWriter = require('broccoli-caching-writer');
const {
  readFile, svgDataFor, toPosixPath, saveToFile, relativePathFor
} = require('./utils');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}


const templateOnlyComponent = (svg) => `
  import templateOnly from '@ember/component/template-only';
  import { setComponentTemplate } from '@ember/component';
  import { hbs } from 'ember-cli-htmlbars';

  export default setComponentTemplate(hbs\`${svg}\`, templateOnly());
  `;

function formatAttrs(attrs) {
  return Object.keys(attrs)
    .map((key) => attrs[key] && `${key}="${attrs[key]}"`)
    .filter((attr) => attr)
    .join(' ');
}

const SVGAsHSBTemplate = ({ attrs, content }) => `
  <svg ${formatAttrs(attrs)} ...attributes>
    {{#if @title}}
      <title id={{@titleId}}> {{@title}} </title>
    {{/if}}
    ${content}
  </svg>
`;

function createJS(_path, svgData) {
  ensureDirectoryExistence(_path);
  let svgHbsTemplate = SVGAsHSBTemplate(svgData)
  let component = templateOnlyComponent(svgHbsTemplate)
  saveToFile(_path, component);
}

class HbsPacker extends CachingWriter {
  constructor(inputNode, opts = {}) {
    super([inputNode], opts);
    this.options = opts;
  }

  build() {
    let inputPath = toPosixPath(this.inputPaths[0]);
    let outputPath = path.join(toPosixPath(this.outputPath), 'components');
    let { makeAssetID } = this.options;

    this.listFiles()
      .forEach((_filePath) => {
        let filePath = toPosixPath(_filePath);
        let relativePath = relativePathFor(filePath, inputPath);
        let svgData = svgDataFor(readFile(filePath));

        let componentName = makeAssetID(relativePath);

        createJS(path.join(outputPath, `${componentName}.js`), svgData);
      });
  }
}

module.exports = HbsPacker;
