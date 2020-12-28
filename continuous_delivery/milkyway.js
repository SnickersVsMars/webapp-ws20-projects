const http = require('http');
const forward = require('http-forward');
const Url = require('url-parse');
 
var server = http.createServer(function (req, res) {
  console.log("Server listening on port 3001");
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();
});
 
server.listen(3001, () =>
    console.log("Server listening on port 3001")
);