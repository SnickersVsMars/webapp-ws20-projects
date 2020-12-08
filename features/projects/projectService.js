const dbConnection = require('../dbConnection');

class ProjectService {
    get(success) {
        dbConnection.select(
            `SELECT p.id, p.number, p.label, p.manager, p.customer, nextM.nextMilestone, COUNT(e.project_id) as employeeCount
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

        var employees = project.employees;
        var milestones = project.milestones;

        delete project.milestones;
        delete project.employees;

        dbConnection.insert('INSERT INTO projects SET ?', project, (result) => {
            for (var i = 0; i < employees.length; i++) {
                employees[i].project_id = result.insertId;
            }

            for (var i = 0; i < employees.length; i++) {
                dbConnection.insert(
                    'INSERT INTO employees SET ?',
                    employees[i],
                    () => {}
                );
            }

            for (var i = 0; i < milestones.length; i++) {
                milestones[i].project_id = result.insertId;
            }

            for (var i = 0; i < milestones.length; i++) {
                dbConnection.insert(
                    'INSERT INTO milestones SET ?',
                    milestones[i],
                    () => {}
                );
            }

            success(result.insertId);
        });
    }
}

module.exports = new ProjectService();
