const mysql = require('mysql');

// Ist keine Klasse da wir private fields haben wollen. 
// In unserem Fall 'connection' und 'handleError'
function DbConnection() {
      let pool = mysql.createPool({
        connectionLimit: 5,
        host: 'localhost',
        user: "wad",
        password: "wad",
        database: "wad"
    });


    
    let handleError = (error) => {
        if(error)
            throw error;
    }

    this.select = (query, success) =>{
        pool.getConnection((error, connection) => {
            handleError(error);
            connection.query(query, (error, results, fields) => {
                handleError(error);
                success(results);
                connection.release();
            });
        });
    };

    this.close = () => {
        pool.end();
    }
}

module.exports = new DbConnection();