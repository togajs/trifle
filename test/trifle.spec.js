/*eslint-env mocha */

var Trifle = require('../src/trifle'),
	expect = require('expect');

describe('trifle spec', function () {
	it('should create an instance', function () {
		var a = new Trifle(),
			b = new Trifle({ name: 'b' });

		expect(a).toBeA(Trifle);
		expect(a.options.name).toBe('trifle');

		expect(b).toBeA(Trifle);
		expect(b.options.name).toBe('b');
	});
});
