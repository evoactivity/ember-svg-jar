import Service from '@ember/service';

export default class SvgJarService extends Service {
  // eslint-disable-next-line
  resolveAsset(path) {
    return `/${path}`;
  }
}
