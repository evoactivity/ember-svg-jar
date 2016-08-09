const cheerio = require('cheerio');

module.exports = function svgDataFor(svgContent) {
  let $svg = cheerio.load(svgContent, { xmlMode: true })('svg');

  return {
    content: $svg.html(),
    attrs: $svg.attr()
  };
};
