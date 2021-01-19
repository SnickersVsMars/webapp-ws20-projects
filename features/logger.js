const fs = require('fs');

const logfile = 'tmp/log.txt';

if (!fs.existsSync('tmp')) {
    fs.mkdirSync('tmp');
}

if (!fs.existsSync(logfile)) {
    fs.writeFileSync(logfile, '');
}

const log = (level, message) => {
    try {
        console.log(message);

        fs.appendFileSync(logfile, '\r\n' + (level + ':').padEnd(8) + message);
    } catch (error) {
        console.log(error);
    }
};

const info = (message) => {
    log('info', message);
};

const error = (message) => {
    log('error', message);
};

module.exports = { info, error };
