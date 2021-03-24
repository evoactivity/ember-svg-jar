import EmberSvgJarService from 'ember-svg-jar/services/svg-jar';
import { inject as service } from '@ember/service';

export default class SvgJarService extends EmberSvgJarService {
  @service assetMap;

  resolveAsset(path) {
    return this.assetMap.resolve(path);
  }
}
