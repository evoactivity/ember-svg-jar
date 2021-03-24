import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';


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

export async function loadSvg(resolver, name) {
  let componentDefinedName = `ember-svg-jar/components/${name}`;
  let invokationName = getInvocationName(name);

  if (!needsLoading(name)) {
    return invokationName;
  }
  const assetPath = await resolver.resolveAsset(`${componentDefinedName}.js`);
  await import(assetPath);
  return invokationName;
}

export default class Svg extends Component {
  @service svgJar;

  constructor() {
    super(...arguments);
    this.updateSvg();
  }

  @tracked _svgComponentName = null;

  @action
  async updateSvg() {
    if (typeof FastBoot === 'undefined') {
      if (needsLoading(this.args.name)) {
        if (this.args.loadingSvg) {
          if (needsLoading(this.args.loadingSvg)) {
            // maybe we didn't bundle the loadingSvg, it will be there for the next one.
            loadSvg(this.svgJar, this.args.loadingSvg);
          } else {
            this._svgComponentName = getInvocationName(this.args.loadingSvg);
          }
        }
        let invokationName = await loadSvg(this.svgJar, this.args.name);
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
  }

  get isAriaHidden() {
    return (!this.args.ariaLabel && !this.args.ariaLabelledBy && !this.args.title);
  }

  get ariaLabelledBy() {
    if (this.titleId || this.descId) {
      return `${this.titleId} ${this.descId}`.trim();
    }
    return '';
  }

  get titleId() {
    if (!this.args.ariaLabel && !this.args.ariaLabelledBy && this.args.title) {
      return guidFor(`${this.args.name}-${this.title}`);
    }
    return '';
  }

  get descId() {
    if (!this.args.ariaLabel && !this.args.ariaLabelledBy && this.args.desc) {
      return guidFor(`${this.args.name}-${this.desc}`);
    }
    return '';
  }
}
