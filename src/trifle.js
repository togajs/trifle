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
	 * @param {Array.<Object.<String,String|RegExp|Function(String)>>} options.formatters
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
	 * Checks for and applies the first matching node formatter.
	 *
	 * @method handleNode
	 * @param {Object} node
	 * @param {*} value
	 */
	handleNode(node, value) {
		var nodeKey = node.key;

		if (value == null || nodeKey == null) {
			return;
		}

		this.options.formatters.some(function update(formatter) {
			var formatterKey = formatter.key;

			if (
				typeof formatterKey === 'string' && formatterKey === nodeKey
				|| formatterKey instanceof RegExp && formatterKey.test(nodeKey)
			) {
				node.update(formatter.format(value, nodeKey, node));
				return true;
			}
		});
	}

	/**
	 * @method _transform
	 * @param {String} file
	 * @param {String} enc
	 * @param {Function} cb
	 */
	_transform(file, enc, cb) {
		var that = this,
			options = this.options,
			extension = options.extension,
			ast = file[options.property];

		if (ast && extension.test(file.path)) {
			traverse(ast).forEach(function (value) {
				that.handleNode(this, value);
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
