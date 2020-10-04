import Component from '@ember/component';
import { compileTemplate as compile } from '@ember/template-compilation';
import { tagName } from '@ember-decorators/component';
import { formatAttrs } from 'ember-svg-jar/utils/make-svg';
import { svgJar } from '../helpers/svg-jar';


const InlineSvgAsHbsTemplate = ({ attrs, content }) => `
<svg ${formatAttrs(attrs)} ...attributes>
  {{#if this.title}}
    <title id={{this.titleId}}> {{this.title}} </title>
  {{/if}}
  ${content}
</svg>
`;

@tagName('')
export default class SvgComponent extends Component {

  get layout() {
    return compile(svgJar(this.name, {}, InlineSvgAsHbsTemplate).string)
  }
}