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
	 * @param {Array.<Object.<String|RegExp,Function(String)>>} options.nodes
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
	 * @param {Object} walker
	 * @param {*} value
	 */
	handleNode(walker, value) {
		var walkerKey = walker.key;

		if (value == null || walkerKey == null) {
			return;
		}

		this.options.nodes.some(function update(node) {
			var nodeKey = node.key;

			if (
				typeof nodeKey === 'string' && nodeKey === walkerKey
				|| nodeKey instanceof RegExp && nodeKey.test(walkerKey)
			) {
				walker.update(node.format(value, walkerKey, walker));
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
			extension = options.extension;

		if (file.ast && extension.test(file.path)) {
			traverse(file.ast).forEach(function (value) {
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

	/** List of nodes and formatters. */
	nodes: [],

	/** The name of the property containing an AST. */
	property: 'ast'
};
