const http = require('http')
const forward = require('http-forward')
 
var server = http.createServer(function (req, res) {
  var parse = require('url-parse')
  , url = parse(req.url, true);
  // Define proxy config params
  req.forward = { target: hostname+':3000' }
  forward(req, res)
})
 
server.listen(4000)