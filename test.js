var Trunc = require ('./trunc.js')

var stream = require ('stream')
var assert = require ('assert')

var r = new stream . Readable ()
var total = 1024 * 1024
r . _read = function (size) {
  r . push (new Buffer (size))
}

var t = new Trunc ({ limit : 100 })
var received = 0

t . on ('data', function (chunk) {
  received += chunk . length
  assert (received <= 100)
})

t . on ('end', function () {
  assert . equal (received, 100)
  console . log ('ok')
})

r . pipe (t)
