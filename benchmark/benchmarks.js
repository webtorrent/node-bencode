// workaround: name of first suite is not printed
console.log('reference before benchmarks')

import './reference-before.js'

import './bencode.js'
import './buffer-vs-string.js'
import './compare-decode.js'
import './compare-encode.js'
import './encoding-length.js'

import './reference-after.js'
