const dbConnection = require('../dbConnection');

class ProjectService {
    get(success) {
        let selectQuery = `SELECT p.id,
                                  p.number,
                                  p.label,
                                  p.manager,
                                  p.customer,
                                  nextM.nextMilestone,
                                  COUNT(e.project_id) as employeeCount
                           FROM projects p
                                    LEFT OUTER JOIN employees e ON p.id = e.project_id
                                    LEFT OUTER JOIN
                                (
                                    SELECT m.project_id AS project_id, MIN(m.date) AS nextMilestone
                                    FROM milestones m
                                    WHERE m.date >= CURRENT_DATE()
                                    GROUP BY m.project_id
                                ) nextM ON p.id = nextM.project_id
                           GROUP BY p.id, p.number, p.label, p.manager, p.customer, nextM.nextMilestone`;

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
            `SELECT * FROM projects WHERE id = ${id}`,
            (error, result) => {
                if (error) {
                    return success(error, null);
                }

                if (!result) {
                    return success(`${id} not found`, null);
                }

                let project = result;
                if (Array.isArray(project)) {
                    if (project.length > 1) {
                        return success(
                            `${id} returns more that one value`,
                            null
                        );
                    }

                    if (project.length < 1) {
                        return success(`${id} not found`, null);
                    }

                    project = project[0];
                }

                dbConnection.select(
                    `SELECT id, name FROM employees WHERE project_id = ${id} ORDER BY name ASC`,
                    (error, result) => {
                        if (error) {
                            return success(error, null);
                        }

                        project.employees = result;

                        dbConnection.select(
                            `SELECT id, date, label, description FROM milestones WHERE project_id = ${id} ORDER BY date ASC`,
                            (error, result) => {
                                if (error) {
                                    return success(error, null);
                                }

                                project.milestones = result;
                                success(null, project);
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

        dbConnection.insert(
            'INSERT INTO projects SET ?    ',
            project,
            (error, result) => {
                if (error) {
                    return success(error, null);
                }

                if (employees !== null && employees !== undefined) {
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

                success(null, result.insertId);
            }
        );
    }

    update(id, project, success) {
        if (id == null || project == null) {
            return null;
        }

        let findSuccess = (error, result) => {
            if (error) {
                return success(error, null);
            }
            let oldProject = result;
            //console.log(oldProject);

            //var employees = this.find(`employees WHERE project_id = ${id}`);

            //das alte Projekt mit dem neuen Projekt überschreiben
            //ausser Nr und projekt id
            // 1.employees  rausholen ->
            dbConnection.select(
                `SELECT id, name FROM employees WHERE project_id = ${id}`,
                (error, employees) => {
                    if (error) {
                        return success(error, null);
                    }

                    let names = [];
                    for (let i = 0; i < employees.length; i++) {
                        names.push(employees[i].name);
                    }

                    for (let i = 0; i < project.employees.length; i++) {
                        let index = names.indexOf(project.employees[i].name);
                        if (index > -1) {
                            names.splice(index, 1);
                        } else {
                            project.employees[i].project_id = id;

                            dbConnection.insert(
                                'INSERT INTO employees SET ?',
                                project.employees[i],
                                () => {}
                            );
                        }
                    }

                    if (names.length > 0) {
                        for (let i = 0; i < names.length; i++) {
                            dbConnection.delete(
                                `DELETE FROM employees WHERE name = "${names[i]}" AND project_id = ${id}`,
                                () => {}
                            );
                        }
                    }
                }
            );

            //2. vergleichen die alten employees mit den neuen!
            //monetane Id und welche im neuen if im neunen welche weg sind löschen
            // sonst welche hinzufügen
            //3. milestones dasselbe
            //4. ausführen von db Conn // neue properties in die db+
            // dbConnection.update(
            //     `UPDATE projects SET ? WHERE id = ${project.id}`,
            //     project,
            //     (error, result) => {
            //         if (error) {
            //             return success(error, null);
            //         }
            //         //
            //     }
            // );
        };
        this.find(id, findSuccess);
    }
}

module.exports = new ProjectService();
