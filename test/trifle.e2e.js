/*eslint-env mocha */

var Trifle = require('../src/trifle'),
	Tunic = require('tunic'),
	expect = require('expect'),
	streamArray = require('stream-array'),
	supply = require('mtil/function/supply'),
	toga = require('toga'),
	join = require('path').join,
	readFileSync = require('fs').readFileSync,

	config = {
		fixtures: join(__dirname, 'fixtures'),
		expected: join(__dirname, 'expected'),
		actual: join(__dirname, 'actual')
	};

describe('trifle e2e', function () {
	describe('raw streams', function () {
		function testWithArray(array, stream, done) {
			var expectChunk = supply(
				function (chunk) {
					expect(chunk).toEqual('hello');
				},
				function (chunk) {
					expect(chunk).toEqual('world');
				}
			);

			streamArray(array)
				.pipe(stream)
				.on('data', expectChunk)
				.on('error', done)
				.on('end', done);
		}

		it('should not parse non-files', function (done) {
			var strings = ['hello', 'world'];

			testWithArray(strings, new Trifle(), done);
		});
	});

	describe('object streams', function () {
		function testWithFile(filename, stream, done) {
			var fixture = join(config.fixtures, filename),
				expected = join(config.expected, filename + '.json');

			function expectFile(file) {
				var actual = JSON.stringify(file.ast, null, 2) + '\n';

				expect(actual).toEqual(String(readFileSync(expected)));
			}

			toga
				.src(fixture)
				.pipe(new Tunic())
				.pipe(stream)
				.on('data', expectFile)
				.on('error', done)
				.on('end', done);
		}

		it('should format matching nodes', function (done) {
			var stream = new Trifle();

			stream.add(function (node, value) {
				if (node.key === 'description' && value != null) {
					node.update(String(value).toUpperCase());
					return false;
				}
			});

			testWithFile('match.js', stream, done);
		});

		it('should not format non-matching nodes', function (done) {
			var stream = new Trifle();

			stream.add(function (node, value) {
				if ((/^description$/).test(node.key)) {
					node.update(String(value).toUpperCase());
					return false;
				}
			});

			testWithFile('nomatch.js', stream, done);
		});
	});
});
