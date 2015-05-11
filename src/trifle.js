/**
 * # Trifle
 *
 * A base formatter for [Toga](http://togajs.github.io) documentation. Provides
 * a hook for walking abstract syntax trees and formatting nodes.
 *
 * @title Trifle
 * @name trifle
 */

import mixin from 'mtil/object/mixin';
import traverse from 'traverse';
import { Transform } from 'stream';

/**
 * @class Trifle
 * @extends Stream.Transform
 */
export default class Trifle extends Transform {
	/**
	 * @constructor
	 * @param {Object} options
	 * @param {RegExp} options.extension
	 * @param {String} options.name
	 * @param {Array.<Function(Object,String):Boolean>} options.formatters
	 * @param {String} options.property
	 */
	constructor(options = {}) {
		super({ objectMode: true });

		/**
		 * @property options
		 * @type {Object}
		 */
		this.options = mixin({}, Trifle.defaults, options);
	}

	/**
	 * @method add
	 * @param {Array.<Function(Object,String):Boolean>} formatter
	 * @chainable
	 */
	add(formatter) {
		this.options.formatters.push(formatter);

		return this;
	}

	/**
	 * @method _transform
	 * @param {String} file
	 * @param {String} enc
	 * @param {Function} cb
	 */
	_transform(file, enc, cb) {
		var options = this.options,
			formatters = options.formatters,
			extension = options.extension,
			ast = file[options.property];

		if (ast && extension.test(file.path)) {
			traverse(ast).forEach(function (value) {
				var node = this;

				// Apply formatters to each node
				formatters.some(function (formatter) {
					// break loop when formatter returns false
					return formatter(node, value) === false;
				});
			});
		}

		cb(null, file);
	}
}

/**
 * Default options.
 *
 * @property defaults
 * @type {Object.<String,RegExp>}
 * @static
 */
Trifle.defaults = {
	/** The name of this plugin. */
	name: 'trifle',

	/** Matches any file extension. */
	extension: /.\w+$/,

	/** List of formatters. */
	formatters: [],

	/** The name of the property containing an AST. */
	property: 'ast'
};
