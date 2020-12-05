const dbConnection = require('../dbConnection');

class ProjectService {
    get(success) {
        dbConnection.select('SELECT * FROM projects', success);
    }

    find(id, success) {
        if (id == null) return null;

        if (typeof id == 'string') id = parseInt(id);
        else if (typeof id !== 'number') return null;

        dbConnection.select(
            `SELECT * FROM projects WHERE id = ${id}`,
            (result) => {
                if (!result) throw `${id} not found`;

                if (Array.isArray(result)) {
                    if (result.length > 1)
                        throw `${id} returns more that one value`;
                    if (result.length < 1) throw `${id} not found`;

                    success(result[0]);
                } else success(result);
            }
        );
    }
}

module.exports = new ProjectService();
