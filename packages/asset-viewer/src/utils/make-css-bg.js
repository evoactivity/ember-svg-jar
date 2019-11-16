import svgToURI from 'mini-svg-data-uri';

export default function makeCSSBG(svg) {
  return `background-image: url("${svgToURI(svg)}")`;
}
