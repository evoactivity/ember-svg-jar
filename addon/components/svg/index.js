import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import resolveAsset from 'ember-cli-resolve-asset';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';


function needsLoading(name) {
  let componentDefinedName = `ember-svg-jar/components/${name}`;
  try {
    if (window.require(componentDefinedName)) {
      return false;
    }
  } catch (e) {} // eslint-disable-line

  return true;
}

function getInvocationName(name) {
  return `ember-svg-jar@${name}`;
}

export async function loadSvg(name) {
  let componentDefinedName = `ember-svg-jar/components/${name}`;
  let invokationName = getInvocationName(name);

  if (!needsLoading(name)) {
    return invokationName;
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

  @tracked _svgComponentName = null;

  @action
  async updateSvg() {
    if (needsLoading(this.args.name)) {
      if (this.args.loadingSvg && needsLoading(this.args.loadingSvg)) {
        // maybe we didn't bundle the loadingSvg, it will be there for the next one.
        loadSvg(this.args.loadingSvg);
      } else {
        this._svgComponentName = getInvocationName(this.args.loadingSvg);
      }

      let invokationName = await loadSvg(this.args.name);
      if (!this.isDestroyed || !this.isDestroying) {
        this._svgComponentName = invokationName;
        this.isLoading = false;
        if (this.args.onIconLoad && typeof this.args.onIconLoad === 'function') {
          this.args.onIconLoad();
        }
      }
    } else {
      this._svgComponentName = getInvocationName(this.args.name);
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
