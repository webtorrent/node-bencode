# Bencode

[![NPM Package](https://img.shields.io/npm/v/bencode.svg?style=flat-square)](https://www.npmjs.org/package/bencode)
[![Build Status](https://img.shields.io/travis/themasch/node-bencode.svg?branch=master&style=flat-square)](https://travis-ci.org/themasch/node-bencode)

[![abstract-encoding](https://img.shields.io/badge/abstract--encoding-compliant-brightgreen.svg?style=flat-square)](https://github.com/mafintosh/abstract-encoding)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

A node library for encoding and decoding bencoded data,
according to the [BitTorrent specification](http://www.bittorrent.org/beps/bep_0003.html).

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

## Install with [npm](https://npmjs.org)

```
npm install bencode
```

## Usage

```javascript
var bencode = require('bencode')
var data = {
  string: 'Hey there!',
  integer: 42,
  dict: { key: 'dict-key-string' },
  list: [ 1, 2, 3, 'str', 5, {}, [] ]
}

console.log(bencode.encodingLength(data))
// 96

var encoded = bencode.encode(data)
console.log(encoded.toString())
// d4:dictd3:key15:dict-key-stringe7:integeri42e4:listli1ei2ei3e3:stri5edelee6:string10:Hey there!e'

console.log(bencode.decode(encoded))
// { dict: { key: 'dict-key-string' },
//   integer: 42,
//   list: [ 1, 2, 3, 'str', 5, {}, [] ],
//   string: 'Hey there!' }
```

You can also use node-bencode with browserify to be able to use it in a lot of modern browsers.

[![testling results](https://ci.testling.com/themasch/node-bencode.png)](https://ci.testling.com/themasch/node-bencode)

## Benchmark

Torrent file for benchmark: [Fedora-Live-MATE_Compiz-x86_64-23.torrent](https://torrent.fedoraproject.org/torrents/Fedora-Live-MATE_Compiz-x86_64-23.torrent)

```shell
$ cd benchmark
$ npm i
...
$ npm start
                      decode
          36,044 op/s » bencode
          24,687 op/s » bencoding
          33,427 op/s » dht_bencode
             532 op/s » bncode
          26,013 op/s » dht

                      encode
          13,234 op/s » bencode
           5,670 op/s » bencoding
           8,534 op/s » dht_bencode
           5,334 op/s » bncode
           5,979 op/s » dht
```

## License

MIT
