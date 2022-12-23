import Helper from '@ember/component/helper';

type SvgJarAssetId = string;

type SvgJarPositional = [SvgJarAssetId];

interface SvgJarAttrs {
  width?: string;
  height?: string;
  class?: string;
  role?: string;
  title?: string;
  desc?: string;
}

type SvgJarReturn = SVGElement;

export interface SvgJarSignature {
  Args: {
    Positional: SvgJarPositional;
    Named: SvgJarAttrs;
  };
  Return: SvgJarReturn;
}

export default class SvgJar extends Helper<SvgJarSignature> {}
