import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import resolveAsset from 'ember-cli-resolve-asset';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class Svg extends Component {

	@tracked loading = false;

	constructor() {
		super(...arguments);
		this.loadSvg.perform(this.args.name);
	}

	@action
	updateSvg() {
		this.loadSvg.perform(this.args.name);
	}

	@(task(function*() {
		let componentDefinedName = `ember-svg-jar/components/${this.args.name}`;
		let invokationName = `ember-svg-jar@${this.args.name}`;
		try {
			if(window.require(componentDefinedName)) {
				return invokationName;
			}
		}catch(e) {}

		const assetPath = yield resolveAsset(`${componentDefinedName}.js`);
		yield import(assetPath);
		return invokationName;
  }))
	loadSvg;


	get isAriaHidden() {
		return (
			!this.args.ariaLabel && !this.args.ariaLabelledBy && !this.args.title
		)
	}

	get titleId() {
		if(!this.args.ariaLabel && !this.args.ariaLabelledBy && this.args.title) {
			return guidFor(`${this.args.name}-${this.title}`);
		}
	}
}