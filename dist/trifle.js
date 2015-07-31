/**
 * # Trifle
 *
 * A base formatter for [Toga](http://togajs.github.io) documentation. Provides
 * a hook for walking abstract syntax trees and formatting nodes.
 *
 * @title Trifle
 * @name trifle
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _stream = require('stream');

/**
 * @class Trifle
 * @extends Stream.Transform
 */

var Trifle = (function (_Transform) {
	_inherits(Trifle, _Transform);

	_createClass(Trifle, null, [{
		key: 'defaults',

		/**
   * Default options.
   *
   * @property {Object} defaults
   * @static
   */
		value: {
			/** The name of the property containing a documentation AST. */
			property: 'docAst',

			/** Matches any file extension. */
			extension: /.\w+$/,

			/** List of formatters. */
			formatters: []
		},
		enumerable: true
	}]);

	/**
  * @constructor
  * @param {Object} options
  */

	function Trifle(options) {
		_classCallCheck(this, Trifle);

		_get(Object.getPrototypeOf(Trifle.prototype), 'constructor', this).call(this, { objectMode: true });

		this.options = null;
		var defaults = Trifle.defaults,
		    formatters = defaults.formatters.slice();

		this.options = _extends({}, defaults, {
			formatters: formatters
		}, options);
	}

	_createClass(Trifle, [{
		key: 'add',

		/**
   * @method add
   * @param {Function(Object,String):Boolean} formatter
   * @chainable
   */
		value: function add(formatter) {
			this.options.formatters.push(formatter);

			return this;
		}
	}, {
		key: 'remove',

		/**
   * @method remove
   * @param {Function(Object,String):Boolean} formatter
   * @chainable
   */
		value: function remove(formatter) {
			var formatters = this.options.formatters;
			var index = formatters.indexOf(formatter);

			if (index > -1) {
				formatters.splice(index, 1);
			}

			return this;
		}
	}, {
		key: 'format',

		/**
   * Destructively formats an AST tree. Returns tree as a convenience.
   *
   * @method format
   * @param {Object} ast
   * @return {Object} Formatted AST.
   */
		value: function format(ast) {
			var formatters = this.options.formatters;

			(0, _traverse2['default'])(ast).forEach(function (value) {
				var node = this;

				// Apply formatters to each node
				formatters.some(function (formatter) {
					// break loop when formatter returns false
					return formatter(node, value) === false;
				});
			});

			return ast;
		}
	}, {
		key: '_transform',

		/**
   * @method _transform
   * @param {String} file
   * @param {String} encoding
   * @param {Function} next
   */
		value: function _transform(file, encoding, next) {
			var _options = this.options;
			var extension = _options.extension;
			var property = _options.property;

			if (!file || file.isAsset || !extension.test(file.path)) {
				this.push(file);
				return next();
			}

			this.format(file[property]);

			this.push(file);
			next();
		}
	}]);

	return Trifle;
})(_stream.Transform);

exports['default'] = Trifle;
module.exports = exports['default'];

/**
 * @property {Object} options
 */