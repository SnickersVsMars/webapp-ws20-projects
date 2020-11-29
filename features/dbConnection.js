const mysql = require("mysql");
const config = require("config");

const poolConfig = config.get("MySqlConnectionPool");

// Declared as function and not as class here, because in default
// JS it is not possible to make private fields in classes.
// Private fields are declared as let and public are declared with this.myfield
// In this case the field 'connection' and the function 'handleError'
// mysql github: https://github.com/mysqljs/mysql
function DbConnection() {
    let pool = mysql.createPool(poolConfig);
    let handleError = (error) => {
        if (error) throw error;
    };

    // query = SQL query string who will be send to the database
    // success = function which will be executed on successfull database call
    this.select = (query, success) => {
        pool.getConnection((error, connection) => {
            handleError(error);
            connection.query(query, (error, results, fields) => {
                handleError(error);
                success(results);
                connection.release();
            });
        });
    };

    // closes the connection to the database
    this.close = () => {
        pool.end();
    };
}

// return instance of function DbConnection, because we want a singleton database connection
module.exports = new DbConnection();
