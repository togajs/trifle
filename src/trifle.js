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
		/** The name of this plugin. */
		name: 'trifle',

		/** Matches any file extension. */
		extension: /.\w+$/,

		/** List of formatters. */
		formatters: [],

		/** The name of the property containing an AST. */
		property: 'ast'
	};

	/**
	 * @constructor
	 * @param {Object} options
	 * @param {RegExp} options.extension
	 * @param {String} options.name
	 * @param {Array.<Function(Object,String):Boolean>} options.formatters
	 * @param {String} options.property
	 */
	constructor(options) {
		super({ objectMode: true });

		this.options = { ...Trifle.defaults, ...options };
	}

	/**
	 * @method add
	 * @param {Function(Object,String):Boolean} formatter
	 * @chainable
	 */
	add(formatter) {
		this.options.formatters.push(formatter);

		return this;
	}

	/**
	 * @method remove
	 * @param {Function(Object,String):Boolean} formatter
	 * @chainable
	 */
	remove(formatter) {
		var formatters = this.options.formatters,
			index = formatters.indexOf(formatter);

		if (index > -1) {
			formatters.splice(index, 1);
		}

		return this;
	}

	/**
	 * @method _transform
	 * @param {String} file
	 * @param {String} enc
	 * @param {Function} cb
	 */
	_transform(file, enc, cb) {
		var { extension, formatters, property } = this.options;

		if (!file || file.isAsset || !extension.test(file.path)) {
			return cb(null, file);
		}

		traverse(file[property]).forEach(function (value) {
			var node = this;

			// Apply formatters to each node
			formatters.some(function (formatter) {
				// break loop when formatter returns false
				return formatter(node, value) === false;
			});
		});

		cb(null, file);
	}
}
