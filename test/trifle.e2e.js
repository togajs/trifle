/* eslint-env mocha */

import Trifle from '../src/trifle';
import Tunic from 'tunic';
import expect from 'expect';
import toga from 'toga';
import { join } from 'path';
import { readFileSync } from 'fs';

var config = {
	fixtures: join(__dirname, 'fixtures'),
	expected: join(__dirname, 'expected'),
	actual: join(__dirname, 'actual')
};

describe('trifle e2e', function () {
	function testWithFile(filename, stream, done) {
		var fixture = join(config.fixtures, filename),
			expected = join(config.expected, filename + '.json');

		function expectFile(file) {
			var actual = JSON.stringify(file.docAst, null, 2) + '\n';

			expect(actual).toEqual(String(readFileSync(expected)));
			// file.contents = new Buffer(actual);
		}

		toga
			.src(fixture)
			.pipe(new Tunic())
			.pipe(stream)
			.on('data', expectFile)
			// .pipe(toga.dest(config.actual))
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

	it('should ignore unknown files', function (done) {
		var stream = new Trifle({
			extension: /\.js$/
		});

		function expectFile(file) {
			expect(file.docAst).toBe(undefined);
		}

		toga
			.src(join(config.fixtures, 'unused.coffee'))
			.pipe(stream)
			.on('data', expectFile)
			.on('error', done)
			.on('end', done);
	});
});
