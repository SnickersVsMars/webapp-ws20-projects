const mysql = require('mysql2/promise');
const config = require('config');

const poolConfig = config.get('MySqlConnectionPool');

// Declared as function and not as class here, because in default
// JS it is not possible to make private fields in classes.
// Private fields are declared as let and public are declared with this.myfield
// In this case the field 'connection' and the function 'handleError'
// mysql github: https://github.com/mysqljs/mysql
function DbConnection() {
    let pool = mysql.createPool(poolConfig);

    // query = SQL query string who will be send to the database
    // success = function which will be executed on successfull database call

    this.select = async (query, params) => {
        let connection = await pool.getConnection();
        let [results] = await connection.execute(query, params);
        connection.release();
        return results;
    };

    this.insert = async (query, params) => {
        let connection = await pool.getConnection();
        let [results] = await connection.query(query, params);
        connection.release();
        return results;
    };

    // closes the connection to the database
    this.close = () => {
        pool.end();
    };
}

// return instance of function DbConnection, because we want a singleton database connection
module.exports = new DbConnection();
