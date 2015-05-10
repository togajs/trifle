/*eslint-env mocha */

import Trifle from '../src/trifle';
import expect from 'expect';

describe('trifle spec', function () {
	it('should create an instance', function () {
		var a = new Trifle();

		expect(a).toBeA(Trifle);
	});
});
