'use strict';

const mkdirp = require('mkdirp');
const path = require('path');
const Plugin = require('broccoli-plugin');
const fs = require('fs');
const cheerio = require('cheerio');
const formatAttrs = require('./format-attrs');

module.exports = class RefsExtractor extends Plugin {
  constructor(inputNode, options) {
    super([inputNode], options);
    this.outputFile = options.outputFile;
  }

  build() {
    let content = fs.readFileSync(path.join(this.inputPaths[0], this.outputFile), 'utf-8');
    content = RefsExtractor.extractDefs(content);
    let dest = `${this.outputPath}/${this.outputFile}`;
    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(dest, content);
  }

  static extractDefs(svgContent) {
    let $svg = cheerio.load(svgContent, { xmlMode: true });
    let config = {
      svgAttrs: {
        style: 'position: absolute; width: 0; height: 0;',
        width: '0',
        height: '0',
        version: '1.1',
        xmlns: 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      },
    };
    let $newSvg = cheerio.load(`<svg ${formatAttrs(config.svgAttrs)}><defs /></svg>`, { xmlMode: true });
    let $defs = $newSvg('defs');
    $svg('symbol')
      .each((i, element) => {
        const $symbol = cheerio(element);
        const extractedRefIds = cheerio('[id]', $symbol)
          .filter((_, elementWithId) => (
            $symbol.html()
              .includes(`#${cheerio(elementWithId)
                .attr('id')}`)
          ))
          .map((j, referencedEl) => {
            const $referencedEl = cheerio(referencedEl);
            const refId = $referencedEl.attr('id');
            $referencedEl.attr('id', `${$symbol.attr('id')}-${refId}`);
            $referencedEl.remove();
            $defs.append($referencedEl);
            return refId;
          });
        cheerio('defs', $symbol).remove();
        let symbolHtml = `<symbol ${formatAttrs($symbol.attr())}>${$symbol.html()}</symbol>`;
        extractedRefIds.each((_, refId) => {
          symbolHtml = symbolHtml.replace(`#${refId}`, `#${$symbol.attr('id')}-${refId}`);
        });
        $defs.after(symbolHtml);
      });
    if ($defs.children().length) {
      return $newSvg.html();
    }
    return svgContent;
  }
};
