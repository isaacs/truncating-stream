# truncating-stream

A Node v0.10 Transform stream that truncates its input at a specified
limit.

Prompted by [this node.js mailing list
question](https://groups.google.com/forum/#!msg/nodejs/eGukJUQrOBY/URD8I7tNxRUJ)

## USAGE

```javascript
var t = new Trunc ({ limit : someNumber })

readable . pipe (t)

var seen = 0
t . on ('data', function (chunk) {
  seen += chunk . length // will never go past someNumber
})
```
