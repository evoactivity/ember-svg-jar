'use strict';

const path = require('path').posix;
const Plugin = require('broccoli-plugin');
const cheerio = require('cheerio');
const formatAttrs = require('./format-attrs');
const { readFile, saveToFile } = require('../utils');

/**
 * Roughly how it works:
 * - find all elements that are referenced by `#id`, e.g. `fill="url(#gradient)"`
 * - now we have referenced elements (targets), e.g. `<linearGradient ... id="gradient">...`
 * - change target's id to make it unique
 * - change all references to target inside symbol to have new id
 * - remove target from the symbol
 * - add target to the sprite's defs
 * - add updated symbol to the sprite
 */
function extractDefs(svgContent) {
  let $svg = cheerio.load(svgContent, { xmlMode: true });
  let $newSvg = cheerio.load(
    `<svg ${formatAttrs($svg('svg').attr())}><defs /></svg>`,
    { xmlMode: true }
  );
  let $defs = $newSvg('defs');

  $svg('symbol').each((_, element) => {
    const $symbol = cheerio(element);
    const extractedRefIds = cheerio('[id]', $symbol)
      .filter((_, elementWithId) =>
        $symbol.html().includes(`#${cheerio(elementWithId).attr('id')}`)
      )
      .map((_, referencedEl) => {
        const $referencedEl = cheerio(referencedEl);
        const refId = $referencedEl.attr('id');
        $referencedEl.attr('id', `${$symbol.attr('id')}-${refId}`);
        $referencedEl.remove();
        $defs.append($referencedEl);
        return refId;
      });
    cheerio('defs', $symbol).remove();
    let symbolHtml = `<symbol ${formatAttrs(
      $symbol.attr()
    )}>${$symbol.html()}</symbol>`;
    extractedRefIds.each((_, refId) => {
      symbolHtml = symbolHtml.replace(
        `#${refId}`,
        `#${$symbol.attr('id')}-${refId}`
      );
    });
    $defs.after(symbolHtml);
  });

  return $defs.children().length ? $newSvg.html() : svgContent;
}

module.exports = class RefsExtractor extends Plugin {
  constructor(inputNode, { outputFile }) {
    super([inputNode]);
    this.outputFile = outputFile;
  }

  build() {
    let outputSvgPath = path.join(this.outputPath, this.outputFile);
    let inputSvgPath = path.join(this.inputPaths[0], this.outputFile);

    saveToFile(outputSvgPath, extractDefs(readFile(inputSvgPath)));
  }
};
