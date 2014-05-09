function Dict() {
  Object.defineProperty( this, "_keys", {
    enumerable: false,
    value: [],
  })
}

Dict.prototype = {
  
  constructor: Dict,
  
  binaryKeys: function() {
    return this._keys.slice()
  },
  
  binarySet: function( key, value ) {
    this._keys.push( key )
    this[ key ] = value
  },
  
}

module.exports = Dict
