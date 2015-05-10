'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x2,
    property = _x3,
    receiver = _x4; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/**
 * # Trifle
 *
 * A base formatter for [Toga](http://togajs.github.io) documentation. Provides
 * a hook for walking abstract syntax trees and formatting nodes.
 *
 * @title Trifle
 * @name trifle
 */

var _mtilObjectMixin = require('mtil/object/mixin');

var _mtilObjectMixin2 = _interopRequireDefault(_mtilObjectMixin);

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _stream = require('stream');

/**
 * @class Trifle
 * @extends Stream.Transform
 */

var Trifle = (function (_Transform) {
	/**
  * @constructor
  * @param {Object} options
  * @param {RegExp} options.extension
  * @param {String} options.name
  * @param {Array.<Object.<String|RegExp,Function(String)>>} options.nodes
  */

	function Trifle() {
		var options = arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Trifle);

		_get(Object.getPrototypeOf(Trifle.prototype), 'constructor', this).call(this, { objectMode: true });

		/**
   * @property options
   * @type {Object}
   */
		this.options = _mtilObjectMixin2['default']({}, Trifle.defaults, options);
	}

	_inherits(Trifle, _Transform);

	_createClass(Trifle, [{
		key: 'handleNode',

		/**
   * Checks for and applies the first matching node formatter.
   *
   * @method handleNode
   * @param {Object} walker
   * @param {*} value
   */
		value: function handleNode(walker, value) {
			var walkerKey = walker.key;

			function update(node) {
				var nodeKey = node.key;

				if (typeof nodeKey === 'string' && nodeKey === walkerKey || nodeKey instanceof RegExp && nodeKey.test(walkerKey)) {
					walker.update(node.format(value, walkerKey));
					return true;
				}
			}

			this.options.nodes.some(update);

			return this;
		}
	}, {
		key: '_transform',

		/**
   * @method _transform
   * @param {String} file
   * @param {String} enc
   * @param {Function} cb
   */
		value: function _transform(file, enc, cb) {
			var that = this,
			    options = this.options,
			    extension = options.extension;

			if (file.ast && extension.test(file.path)) {
				_traverse2['default'](file.ast).forEach(function (value) {
					that.handleNode(this, value);
				});
			}

			cb(null, file);
		}
	}]);

	return Trifle;
})(_stream.Transform);

exports['default'] = Trifle;

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
	nodes: []
};
module.exports = exports['default'];