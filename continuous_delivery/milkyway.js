const http = require('http');
const Url = require('url-parse');
const mysql = require('mysql2/promise');
const path = require('path');

// get database config from config file
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '..', 'config');
const config = require('config');

const poolConfig = config.get('HostingPool');
const logger = require('../features/logger');

// create simple http server for the reverse proxy
http.createServer(function (req, res) {
    let pool = mysql.createPool(poolConfig);
    let url = new Url('https://' + req.headers['host'] + req.url);
    let route = url.pathname;

    pool.getConnection()
        .then((conn) => {
            conn.query('SELECT port FROM HostingTable WHERE route = ?', [route])
                .then(([rows, fields]) => {
                    logger.info('route 2: ' + route);
                    if (rows.length > 0) {
                        res.writeHead(302, {
                            Location:
                                'http://' +
                                url.hostname +
                                ':' +
                                rows[0]['port'],
                        });
                    } else {
                        res.write(route + ' not found in routing table');
                    }
                    res.end();
                })
                .catch((err) => {
                    throw err;
                })
                .finally(() => {
                    conn.release();
                });
        })
        .catch((err) => {
            throw err;
        });
}).listen(8081, function (err) {
    if (err) throw err;
    logger.info('up and running');
});
