const dbConnection = require('../dbConnection');

class FileService {
    async delete(id) {
        if (id == null) {
            return null;
        }

        if (typeof id == 'string') {
            id = parseInt(id);
        }

        if (typeof id !== 'number' || isNaN(id)) {
            return null;
        }

        let result = await dbConnection.insert(
            `DELETE FROM files WHERE id = ?`,
            [id]
        );

        if (result.affectedRows == 0) throw 'Not found';

        return '';
    }

    async find(id) {
        if (id == null) {
            return null;
        }

        if (typeof id == 'string') {
            id = parseInt(id);
        }

        if (typeof id !== 'number' || isNaN(id)) {
            return null;
        }

        let file = await dbConnection.select(
            `SELECT * FROM files WHERE id = ?`,
            [id]
        );

        if (!file) {
            throw `${id} not found`;
        }

        if (Array.isArray(file)) {
            if (file.length > 1) {
                throw `${id} returns more that one value`;
            }

            if (file.length < 1) {
                throw `${id} not found`;
            }
            file = file[0];
        }

        return file;
    }

    async insert(file) {
        if (file == null) {
            return null;
        }

        if (file.length < 1) {
            return null;
        }

        let result = await dbConnection.select(
            `SELECT count(*) as count
                FROM files where project_id = ?`,
            [file.project_id]
        );

        if (result[0].count >= 5) throw `Nur 5 Dateien erlaubt!`;

        let inserted_id = await dbConnection.insert('INSERT INTO files SET ?', [
            file,
        ]);
        return inserted_id;
    }
}

module.exports = new FileService();
