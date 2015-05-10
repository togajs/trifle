**NOTE: This project is under active development. APIs subject to change.**

# `trifle`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url]

A base formatter for [Toga](http://togajs.github.io) documentation. Provides a hook for walking abstract syntax trees and formatting nodes.

## Install

    $ npm install --save-dev trifle

## API

### `new Trifle([options])`

- `options` `{Object}`
  - `name` `{String}` - Name of plugin. _(Default: `'trifle'`)_
  - `property` `{RegExp}` - Name of property that contains the AST in Vinyl files. _(Default: `'ast'`)_
  - `extension` `{RegExp}` - Matches the file extension or extensions which are handled by this parser.
  - `formatters` `{Array.<Object.<String|RegExp,Function(String)>>}` - A list of node formatters.

Creates a reusable formatter based on the given options.

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

```js
formatters: [
    {
        key: 'description',
        format: function (value) {
            return String(value).toUpperCase();
        }
    },
    {
        key: /^(title|method|property)$/,
        format: function (value, key, node) {
            return key + ': ' + String(value).toLowerCase();
        }
    }
]
```

## Test

    $ npm test

## Contribute

[![Tasks][waffle-img]][waffle-url] [![Tip][gittip-img]][gittip-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

----

© 2015 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[coveralls-img]: http://img.shields.io/coveralls/togajs/trifle/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/togajs/trifle
[downloads-img]: http://img.shields.io/npm/dm/trifle.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/togajs/toga
[gittip-img]:    http://img.shields.io/gittip/shannonmoeller.svg?style=flat-square
[gittip-url]:    https://www.gittip.com/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/trifle.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/trifle
[travis-img]:    http://img.shields.io/travis/togajs/trifle.svg?style=flat-square
[travis-url]:    https://travis-ci.org/togajs/trifle
[waffle-img]:    http://img.shields.io/github/issues/togajs/trifle.svg?style=flat-square
[waffle-url]:    http://waffle.io/togajs/trifle
