import type SvgJar from './helpers/svg-jar';

export default interface EmberSvgJarRegistry {
  'svg-jar': typeof SvgJar;
}
