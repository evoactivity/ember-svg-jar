import Component from '@ember/component';
import { compileTemplate as compile } from '@ember/template-compilation';
import { svgJar } from '../helpers/svg-jar';
import { formatAttrs } from 'ember-svg-jar/utils/make-svg';


const InlineSvgAsHbsTemplate = ({ attrs, content }) => `
<svg ${formatAttrs(attrs)} ...attributes>
  {{#if this.title}}
    <title id={{this.titleId}}> {{this.title}} </title>
  {{/if}}
  ${content}
</svg>
`;

export default class SvgComponent extends Component {
  tagName = '';

  get layout(){
	  console.log(svgJar(this.name, InlineSvgAsHbsTemplate).string)
    return compile(svgJar(this.name, {}, InlineSvgAsHbsTemplate).string)
  }
}