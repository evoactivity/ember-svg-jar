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
    let $newSvg = cheerio.load(`<svg ${formatAttrs($svg('svg').attr())}><defs /></svg>`, { xmlMode: true });
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
