const dbConnection = require('../dbConnection');

class ProjectService {
    get(success) {
        dbConnection.select(
            `SELECT p.id, p.number, p.label, p.manager, p.customer, nextM.nextMilestone, COUNT(*) as employeeCount
            FROM projects p
                LEFT OUTER JOIN employees e ON p.id=e.project_id
                LEFT OUTER JOIN
                    (
                        SELECT m.project_id AS project_id, MIN(m.date) AS nextMilestone
                        FROM milestones m
                        WHERE m.date >= CURRENT_DATE()
                        GROUP BY m.project_id
                    ) nextM ON p.id = nextM.project_id
            GROUP BY p.id, p.number, p.label, p.manager, p.customer, nextM.nextMilestone`,
            success
        );
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

                let project = result;
                if (Array.isArray(project)) {
                    if (project.length > 1) {
                        throw `${id} returns more that one value`;
                    }
                    if (project.length < 1) {
                        throw `${id} not found`;
                    }

                    project = project[0];
                }

                dbConnection.select(
                    `SELECT id, name FROM employees WHERE project_id = ${id}`,
                    (result) => {
                        project.employees = result;

                        dbConnection.select(
                            `SELECT id, date, label, description FROM milestones WHERE project_id = ${id}`,
                            (result) => {
                                project.milestones = result;

                                success(project);
                            }
                        );
                    }
                );
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
