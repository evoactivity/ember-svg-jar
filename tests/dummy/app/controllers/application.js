import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
	yell() {
		alert('hello');
	}
}