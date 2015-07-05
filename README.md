**NOTE: This project is under active development. APIs subject to change.**

# `trifle`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url] [![Tip][amazon-img]][amazon-url]

A base formatter for [Toga](http://togajs.github.io) documentation. Provides a hook for walking abstract syntax trees and formatting nodes.

## Install

    $ npm install --save-dev trifle

## API

### `new Trifle([options])`

- `options` `{Object}`
  - `name` `{String}` - Name of plugin. _(Default: `'trifle'`)_
  - `property` `{RegExp}` - Name of property that contains the AST in Vinyl files. _(Default: `'ast'`)_
  - `extension` `{RegExp}` - Matches the file extension or extensions which are handled by this parser.
  - `formatters` `{Array.<Function(Object,String):Boolean>}` - A list of node formatters.

Creates a reusable formatter based on the given options.

### `#add(formatter) : this`

- `formatter` `{Function(Object,*):Boolean}` - Formatter to add.

Adds a formatter to be used.

```js
.add(function (node, value) {
    if ((/^(title|method|property)$/).test(node.key)) {
        node.update(node.key + ': ' + String(value).toLowerCase());
    }
})
```

### `#pipe(stream) : Stream.Readable`

- `stream` `{Writable}` - Writable stream.

Trifle is a [Transform Stream](http://nodejs.org/api/stream.html#stream_class_stream_transform), working in object mode. ASTs stored in the `.ast` property of [Vinyl](https://github.com/wearefractal/vinyl) objects will be walked and formatted.

## Example

```js
var toga = require('toga'),
    Trifle = require('trifle');

toga.src('./lib/**/*.js')
    // ... parser(s)
    .pipe(new Trifle()) // walks `.ast` and formats nodes
    // ... compiler(s)
    .pipe(toga.dest('./docs'));
```

### Formatters

Formatters are functions that accept a [traverse node context](https://github.com/substack/js-traverse#context) and a value. They will be executed in order for each node in the AST. You can keep subsequent formatters from executing by returning `false`.

```js
formatters: [
    function (node, value) {
        if (node.key === 'description' && value != null) {
            node.update(String(value).toUpperCase());
            return false; // don't apply other formatters to this node
        }
    },
    function (node, value) {
        if ((/^(title|method|property)$/).test(node.key)) {
            node.update(node.key + ': ' + String(value).toLowerCase());
        }
    }
]
```

## Test

    $ npm test

## Contribute

[![Tasks][waffle-img]][waffle-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

----

© 2015 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/togajs/trifle/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/togajs/trifle
[downloads-img]: http://img.shields.io/npm/dm/trifle.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/togajs/toga
[npm-img]:       http://img.shields.io/npm/v/trifle.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/trifle
[travis-img]:    http://img.shields.io/travis/togajs/trifle.svg?style=flat-square
[travis-url]:    https://travis-ci.org/togajs/trifle
[waffle-img]:    http://img.shields.io/github/issues/togajs/trifle.svg?style=flat-square
[waffle-url]:    http://waffle.io/togajs/trifle
