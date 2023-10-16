import Helper from '@ember/component/helper';

type SvgJarAssetId = string;

type SvgJarPositional = [SvgJarAssetId];

interface SvgJarAttrs {
  width?: string | null;
  height?: string | null;
  class?: string | null;
  role?: string | null;
  title?: string | null;
  desc?: string | null;
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
