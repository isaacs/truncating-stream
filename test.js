var Trunc = require ('./trunc.js')

var stream = require ('stream')
var assert = require ('assert')

function test (total) {
  var r = new stream . Readable ()
  var read = 0
  r . _read = function (size) {
    size = Math . max (0, Math . min (size, total - read))
    read += size
    if (size > 0)
      r . push (new Buffer (size))
    else
      r . push (null)
  }

  var t = new Trunc ({ limit : 100 })
  var received = 0

  t . on ('data', function (chunk) {
    received += chunk . length
    assert (received <= 100)
  })

  t . on ('end', function () {
    if (total > 100)
      assert . equal (received, 100)
    else
      assert . equal (received, total)
  })

  var tFinished = false
  t . on ('finish', function () {
    tFinished = true
    process . nextTick (function () {
      assert . equal (r . _readableState . pipes, null)
      r . resume ()
    })
  })

  var rEnded = false
  r . on ('end', function () {
    assert . equal (read, total)
    rEnded = true
  })

  process . on ('exit', function () {
    assert (tFinished)
    assert (rEnded)
    console . log ('ok - total=%d', total)
  })

  r . pipe (t)
}

test (1024 * 64)
test (50)
test (100)
