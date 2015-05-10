import Foo from 'foo';

export default class Bar extends Foo {
	constructor(options) {
		super(options);
	}

	log(value) {
		console.log(value);
		return this;
	}
}
