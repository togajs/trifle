/*eslint-env mocha */

import Trifle from '../src/trifle';
import Tunic from 'tunic';
import expect from 'expect';
import streamArray from 'stream-array';
import supply from 'mtil/function/supply';
import vinylFs from 'vinyl-fs';
import { join } from 'path';
import { readFileSync } from 'fs';

var config = {
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

			vinylFs
				.src(fixture)
				.pipe(new Tunic())
				.pipe(stream)
				.on('data', expectFile)
				.on('error', done)
				.on('end', done);
		}

		it('should format matching nodes', function (done) {
			var options = {
				formatters: [
					function (node, value) {
						if (node.key === 'description' && value != null) {
							node.update(String(value).toUpperCase());
							return false;
						}
					}
				]
			};

			testWithFile('match.js', new Trifle(options), done);
		});

		it('should not format non-matching nodes', function (done) {
			var options = {
				formatters: [
					function (node, value) {
						if ((/^description$/).test(node.key)) {
							node.update(String(value).toUpperCase());
							return false;
						}
					}
				]
			};

			testWithFile('nomatch.js', new Trifle(options), done);
		});
	});
});
