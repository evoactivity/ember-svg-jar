import type SvgJar from './helpers/svg-jar';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'svg-jar': typeof SvgJar;
    svgJar: typeof SvgJar;
  }
}
