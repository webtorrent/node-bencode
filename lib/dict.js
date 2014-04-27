var Dict = module.exports = function Dict() {
  Object.defineProperty(this, "_keys", {
    enumerable: false,
    value: {},
  })
}

Dict.prototype.binaryKeys = function binaryKeys() {
  return Object.keys(this._keys).map(function(e) {
    return Buffer(e, "hex")
  })
}

Dict.prototype.binaryGet = function binaryGet(key) {
  key = key.toString("hex")

  return this._keys[key] && this[this._keys[key]]
}

Dict.prototype.binarySet = function binarySet(key, value) {
  this._keys[key.toString("hex")] = key.toString()

  this[key] = value
}
