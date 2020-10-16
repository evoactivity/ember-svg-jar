import Component from '@glimmer/component';

export default class Svg extends Component {

	constructor() {
		super(...arguments);
		this.loadSvg(this.args.name);
	}

	async loadSvg(name) {
		console.log(name);
		name = 'icon';
		
		import("./ember-svg-jar/svg/icon").then(module => console.log(module));
	}
}