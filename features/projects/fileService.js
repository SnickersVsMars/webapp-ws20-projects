const dbConnection = require('../dbConnection');

class FileService {
    get(success) {
        let selectQuery = `SELECT id, project_id, filename, content
        FROM files`;

        dbConnection.select(selectQuery, success);
    }

    find(id, success) {
        if (id == null) {
            return null;
        }

        if (typeof id == 'string') {
            id = parseInt(id);
        }

        if (typeof id !== 'number' || isNaN(id)) {
            return null;
        }

        dbConnection.select(
            `SELECT * FROM files WHERE id = ${id}`,
            (error, result) => {
                if (error) {
                    return success(error, null);
                }

                if (!result) {
                    return success(`${id} not found`, null);
                }

                let file = result;
                if (Array.isArray(file)) {
                    if (file.length > 1) {
                        return success(
                            `${id} returns more that one value`,
                            null
                        );
                    }

                    if (file.length < 1) {
                        return success(`${id} not found`, null);
                    }

                    file = file[0];
                }
            }
        );
    }

    insert(file, success) {
        if (file == null) {
            return null;
        }

        if (file.length < 1) {
            return null;
        }

        dbConnection.insert(
            'INSERT INTO files SET ?',
            file,
            (error, result) => {
                if (error) {
                    return success(error, null);
                }
                success(null, result.insertId);
            }
        );
    }
}

module.exports = new FileService();