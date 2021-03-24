import Service from '@ember/service';
import { assert } from '@ember/debug';

export default class SvgJarService extends Service {
  // eslint-disable-next-line
  resolveAsset() {
    assert('Must implement resolveAsset method on /services/svg-jar in host app');
  }
}
