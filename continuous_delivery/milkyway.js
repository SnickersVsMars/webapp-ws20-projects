const http = require('http');
const Url = require('url-parse');
const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'snickersvsmars.online',
    user: 'user',
    password: 'IleXTrUegYPhopECTAL',
    database: 'hosting',
});

http.createServer(function (req, res) {
    let url = new Url('https://' + req.headers['host'] + req.url);
    let route = url.pathname;
    console.log('route: ' + req.protocol);
    con.query(
        'SELECT port FROM HostingTable WHERE route = ?',
        [route],
        function (err, rows) {
            console.log('route 2: ' + route);
            if (err) throw err;
            if (rows.length > 0) {
                res.writeHead(302, {
                    Location: 'http://' + url.hostname + ':' + rows[0]['port'],
                });
            } else res.write(route + ' not found in routing table');
            res.end();
        }
    );
}).listen(8081, function (err) {
    if (err) throw err;
    console.log('up and running');
});
