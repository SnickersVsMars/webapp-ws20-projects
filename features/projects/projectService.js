const dbConnection = require('../dbConnection');

class ProjectService {
    get(success) {
        dbConnection.select('SELECT * FROM projects', success);
    }

    find(id, success) {
        if (id == null) {
            return null;
        }

        if (typeof id == 'string') {
            id = parseInt(id);
        } else if (typeof id !== 'number') {
            return null;
        }

        dbConnection.select(
            `SELECT * FROM projects WHERE id = ${id}`,
            (result) => {
                if (!result) {
                    throw `${id} not found`;
                }

                if (Array.isArray(result)) {
                    if (result.length > 1) {
                        throw `${id} returns more that one value`;
                    }
                    if (result.length < 1) {
                        throw `${id} not found`;
                    }

                    success(result[0]);
                } else success(result);
            }
        );
    }

    insert(values, success) {
        if (values == null) {
            return null;
        }

        if (values.length < 1) {
            return null;
        }

        dbConnection.insert(
            `START TRANSACTION;
        INSERT INTO projects (id, number, label, description, manager, customer, costcenter) VALUES ?;
        INSERT INTO employees (project_id, name) VALUES ?;
        INSERT INTO milestones (date, label, descrption, project_id) VALUES ?;
        COMMIT`,
            [[projects], [employees], [milestones]],
            success
        );
    }
}

module.exports = new ProjectService();
