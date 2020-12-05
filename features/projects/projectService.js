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

    insert(project, success) {
        if (project == null) {
            return null;
        }

        if (project.length < 1) {
            return null;
        }

        var projectValues = [project.number];

        dbConnection.insert(
            'INSERT INTO projects (id, number, label, description, manager, customer, costcenter) VALUES ?',
            projectValues,
            (result) => {
                let employeesValues = new Array();

                for (const employee of project.employees) {
                    employeesValues.push(employee);
                }

                dbConnection.insert(
                    'INSERT INTO employees (project_id, name) VALUES ?',
                    employeesValues
                );

                var milestonesValues = [];

                for (const milestone of project.milestones) {
                    milestonesValues.push([milestone.date]);
                }

                dbConnection.insert(
                    'INSERT INTO milestones (date, label, descrption, project_id) VALUES ?',
                    milestonesValues
                );

                return result.insertId;
            }
        );

        // connection.query('INSERT INTO posts SET ?', {title: 'test'}, function(err, result, fields) {
        //     if (err) throw err;

        //     console.log(result.insertId);
        //   });

        // dbConnection.insert(
        //     `START TRANSACTION;
        // INSERT INTO projects (number, label, description, manager, customer, costcenter) VALUES ?;
        // INSERT INTO employees (project_id, name) VALUES ?;
        // INSERT INTO milestones (date, label, descrption, project_id) VALUES ?;
        // COMMIT`,
        //     [[projects], [employees], [milestones]],
        //     success
        // );
    }
}

module.exports = new ProjectService();
