import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import resolveAsset from 'ember-cli-resolve-asset';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';


export async function loadSvg(name) {
  let componentDefinedName = `ember-svg-jar/components/${name}`;
  let invokationName = `ember-svg-jar@${name}`;
  try {
    if (window.require(componentDefinedName)) {
      return invokationName;
    }
  } catch (e) {
    throw new Error(e);
  }

  const assetPath = await resolveAsset(`${componentDefinedName}.js`);
  await import(assetPath);
  return invokationName;
}

export default class Svg extends Component {
  constructor() {
    super(...arguments);
    this.updateSvg();
  }

  @tracked _lastValue = null;

  @action
  async updateSvg() {
    let invokationName = await loadSvg(this.args.name);
    if (!this.isDestroyed || !this.isDestroying) {
      this._lastValue = invokationName;
    }
  }

  get isAriaHidden() {
    return (!this.args.ariaLabel && !this.args.ariaLabelledBy && !this.args.title);
  }

  get titleId() {
    if (!this.args.ariaLabel && !this.args.ariaLabelledBy && this.args.title) {
      return guidFor(`${this.args.name}-${this.title}`);
    }
    return '';
  }
}
