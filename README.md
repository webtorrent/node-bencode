
# node-bencode [![build status](https://secure.travis-ci.org/themasch/node-bencode.png)](http://travis-ci.org/themasch/node-bencode)

A node library for encoding and decoding bencoded data,
according to the [BitTorrent specification](http://www.bittorrent.org/beps/bep_0003.html).

## Index

- [About BEncoding](#about-bencoding)
- [Installation](#install-with-npm)
- [Performance](#performance)
- [Usage](#usage)
- [API](#api)

## About BEncoding

from [Wikipedia](https://en.wikipedia.org/wiki/Bencoding):

Bencode (pronounced like B encode) is the encoding used by the peer-to-peer
file sharing system BitTorrent for storing and transmitting loosely structured data.

It supports four different types of values:
- byte strings
- integers
- lists
- dictionaries

Bencoding is most commonly used in torrent files.
These metadata files are simply bencoded dictionaries.

## Install with [npm](http://npmjs.org)

```
npm install bencode
```

## Performance

### encode
```
bencode x 10,933 ops/sec ±1.43% (90 runs sampled)
bencoding x 7,864 ops/sec ±0.91% (92 runs sampled)
dht-bencode x 7,028 ops/sec ±8.01% (72 runs sampled)
bncode x 6,713 ops/sec ±2.62% (82 runs sampled)
dht.js x 13,762 ops/sec ±1.17% (92 runs sampled)
```

### decode
```
bencode x 34,142 ops/sec ±0.18% (101 runs sampled)
bencoding x 37,041 ops/sec ±0.50% (99 runs sampled)
dht-bencode x 29,211 ops/sec ±0.30% (99 runs sampled)
bncode x 1,208 ops/sec ±0.84% (100 runs sampled)
dht.js x 27,651 ops/sec ±0.78% (100 runs sampled)
```

*Benchmarks run on an Intel Core i5-3427U CPU @ 2.29 GHz with node v0.10.4*

## Usage

```javascript
var bencode = require( 'bencode' )
```

### Encoding

```javascript

var data = {
  string: 'Hello World',
  integer: 12345,
  dict: {
    key: 'This is a string within a dictionary'
  },
  list: [ 1, 2, 3, 4, 'string', 5, {} ]
}

var result = bencode.encode( data )

```

#### Output

```
d4:dictd3:key36:This is a string within a dictionarye7:integeri12345e4:listli1ei2ei3ei4e6:stringi5edee6:string11:Hello Worlde
```

### Decoding

```javascript
var data   = new Buffer( 'd6:string11:Hello World7:integeri12345e4:dictd3:key36:This is a string within a dictionarye4:litli1ei2ei3ei4e6:stringi5edeee' )
var result = bencode.decode( data )
```

#### Output

```javascript
{
  string: <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>,
  integer: 12345,
  dict: {
    key: <Buffer 54 68 69 73 20 69 73 20 61 20 73 74 72 69 6e 67 20 77 69 74 68 69 6e 20 61 20 64 69 63 74 69 6f 6e 61 72 79>
  },
  list: [ 1, 2, 3, 4, <Buffer 73 74 72 69 6e 67>, 5, {} ]
}
```

Automagically convert bytestrings to strings:

```javascript
var result = bencode.decode( data, 'utf8' )
```

#### Output

```javascript
{
  string: 'Hello World',
  integer: 12345,
  dict: {
    key: 'This is a string within a dictionary'
  },
  list: [ 1, 2, 3, 4, 'string', 5, {} ]
}
```

## API

### bencode.encode( *data* )

> `Buffer` | `Array` | `String` | `Object` | `Number` __data__

Returns `Buffer`

### bencode.decode( *data*, *encoding* )

> `Buffer` __data__
> `String` __encoding__

If `encoding` is set, bytestrings are
automatically converted to strings.

Returns `Object` | `Array` | `Buffer` | `String` | `Number`
