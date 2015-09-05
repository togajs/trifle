/**
 * # Trifle
 *
 * A base formatter for [Toga](http://togajs.github.io) documentation. Provides
 * a hook for walking abstract syntax trees and formatting nodes.
 *
 * @title Trifle
 * @name trifle
 */

import traverse from 'traverse';
import { Transform } from 'stream';

/**
 * @class Trifle
 * @extends Stream.Transform
 */
export default class Trifle extends Transform {
	/**
	 * @property {Object} options
	 */
	options = null;

	/**
	 * Default options.
	 *
	 * @property {Object} defaults
	 * @static
	 */
	static defaults = {
		/** The name of the property containing a documentation AST. */
		property: 'docAst',

		/** Matches any file extension. */
		extension: /.\w+$/,

		/** List of formatters. */
		formatters: []
	};

	/**
	 * @constructor
	 * @param {Object} options
	 */
	constructor(options) {
		super({ objectMode: true });

		var { defaults } = Trifle,
			formatters = defaults.formatters.slice();

		this.options = {
			...defaults,
			formatters,
			...options
		};
	}

	/**
	 * @method add
	 * @param {Function(Object,String):Boolean} formatter
	 * @chainable
	 */
	add(formatter) {
		if (typeof formatter !== 'function') {
			return this;
		}

		this.options.formatters
			.push(formatter);

		return this;
	}

	/**
	 * @method remove
	 * @param {Function(Object,String):Boolean} formatter
	 * @chainable
	 */
	remove(formatter) {
		if (typeof formatter !== 'function') {
			return this;
		}

		var { formatters } = this.options,
			index = formatters.indexOf(formatter);

		console.log('index', index);

		if (index > -1) {
			formatters.splice(index, 1);
		}

		return this;
	}

	/**
	 * Destructively formats an AST tree. Returns tree as a convenience.
	 *
	 * @method format
	 * @param {Object} ast
	 * @return {Object} Formatted AST.
	 */
	format(ast) {
		if (ast == null || typeof ast !== 'object') {
			return ast;
		}

		var { formatters } = this.options;

		traverse(ast).forEach(function (value) {
			var node = this;

			// Apply formatters to each node
			formatters.some(function (formatter) {
				// break loop when formatter returns false
				return formatter(node, value) === false;
			});
		});

		return ast;
	}

	/**
	 * @method _transform
	 * @param {String} file
	 * @param {String} encoding
	 * @param {Function} next
	 */
	_transform(file, encoding, next) {
		var { extension, property } = this.options;

		if (!file || file.isAsset || !extension.test(file.path)) {
			this.push(file);
			return next();
		}

		this.format(file[property]);

		this.push(file);
		next();
	}
}
