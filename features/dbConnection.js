const mysql = require('mysql');

// Ist keine Klasse da wir private fields haben wollen. 
// In unserem Fall 'connection' und 'handleError'
function DbConnection() {
    let connection = mysql.createConnection({
        host: "localhost",
        user: "wad",
        password: "wad",
        database: "wad"
      });

    
    let handleError = (error) => {
        if(error)
            throw error;
    }

    connection.connect(handleError);    

    this.select = (query, success) =>{
        connection.query(query, (error, results, fields) => {
            handleError(error);
            success(results);
        });
    };

    this.close = () => {
        connection.end();
    }
}

module.exports = new DbConnection();