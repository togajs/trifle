/* eslint-env mocha */

import Trifle from '../src/trifle';
import expect from 'expect';

describe('trifle spec', function () {
	var trifle;

	beforeEach(function () {
		trifle = new Trifle();
	});

	it('should create a duplex stream', function () {
		expect(trifle).toBeA(Trifle);
		expect(trifle.pipe).toBeA(Function);
		expect(trifle.readable).toBe(true);
		expect(trifle.writable).toBe(true);
	});

	describe('#add', function () {
		it('should ignore non-function values', function () {
			trifle
				.add()
				.add(null)
				.add('hi')
				.add(1234)
				.add(true);

			expect(trifle.options.formatters).toEqual([]);
		});

		it('should add a formatter', function () {
			function foo() {}
			function bar() {}
			function baz() {}

			trifle
				.add(foo)
				.add(bar)
				.add(baz);

			expect(trifle.options.formatters).toEqual([
				foo,
				bar,
				baz
			]);
		});
	});

	describe('#remove', function () {
		it('should ignore non-function values', function () {
			function foo() {}
			function bar() {}

			trifle
				.add(foo)
				.remove()
				.remove(null)
				.remove('hi')
				.remove(1234)
				.remove(true)
				.remove(bar);

			expect(trifle.options.formatters).toEqual([
				foo
			]);
		});

		it('should remove a formatter', function () {
			function foo() {}
			function bar() {}
			function baz() {}

			trifle
				.add(foo)
				.add(bar)
				.add(baz)
				.remove(bar);

			expect(trifle.options.formatters).toEqual([
				foo,
				baz
			]);
		});
	});

	describe('#format', function () {
		it('should ignore non-object values', function () {
			trifle.format();
			trifle.format(null);
			trifle.format('hi');
			trifle.format(1234);
			trifle.format(true);
		});

		it('should apply formatters to a tree', function () {
			var retval,
				tree = {
					foo: 'bar'
				};

			function upper(node, value) {
				if (node.key === 'foo') {
					node.update(value.toUpperCase());
				}
			}

			retval = trifle
				.add(upper)
				.format(tree);

			expect(retval).toBe(tree);
			expect(tree).toEqual({
				foo: 'BAR'
			});
		});
	});
});
