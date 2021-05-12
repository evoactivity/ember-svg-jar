import Service from '@ember/service';
import { getOwner } from '@ember/application';

export default class SvgJarService extends Service {
  // eslint-disable-next-line
  resolveAsset(path) {
    const { rootURL = '' } = getOwner(this).resolveRegistration('config:environment');
    return `${rootURL}${path}`;
  }
}
