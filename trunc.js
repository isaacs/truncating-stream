module.exports = Trunc

var stream = require ('stream')
var util = require ('util')

util . inherits (Trunc, stream . Transform)

var debug
if (util . debuglog)
  debug = util . debuglog ('trunc')
else if (/\btrunc\b/i . test (process . env . NODE_DEBUG || ''))
  debug = console . error
else
  debug = function () {}

function Trunc (options) {
  debug ('ctor', options)
  stream . Transform . call (this, options)
  this . _limit = ~~ options . limit || Infinity
  this . _seen = 0
}

Trunc . prototype . _transform = function (chunk, encoding, cb) {
  debug ('_tx limit=%d seen=%d', this._limit, this._seen)
  if (this . _seen < this . _limit) {
    var len = Math . min (chunk . length, this . _limit - this . _seen)
    if (len !== chunk . length)
      chunk = chunk . slice (0, len)
    this . _seen += len
    debug ('_tx pushing %d', len)
    this . push (chunk)
    if (this . _seen >= this . _limit)
      this . push (null)
  }
  cb()
}

// Don't even both transforming if we're over the limit
// Just return false.
// This isn't strictly necessary, but it is friendly.
Trunc . prototype . write = function (chunk, encoding, cb) {
  var ret
  if (this . _seen >= this . _limit)
    ret = false
  else
    ret = stream . Transform . prototype . write . apply (this, arguments)
  return ret
}
