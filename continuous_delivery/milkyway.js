const http = require('http');
const forward = require('http-forward');
const Url = require('url-parse');
 
var server = http.createServer(function (req, res) {
  var url = new Url(req.url);
  req.forward = { target: url.hostname+':3000' };
  forward(req, res);
});
 
server.listen(4000, () =>
    console.log("Server listening on port 4000")
);