const dbConnection = require('../dbConnection');
const projectRouter = require('./projectRouter');

const getProjectsQuery = `
    SELECT p.id, p.number, p.label, p.manager, p.customer, nextM.nextMilestone, COUNT(e.project_id) as employeeCount
    FROM projects p
        LEFT OUTER JOIN employees e ON p.id=e.project_id
        LEFT OUTER JOIN
            (
                SELECT m.project_id AS project_id, MIN(m.date) AS nextMilestone
                FROM milestones m
                WHERE m.date >= CURRENT_DATE()
                GROUP BY m.project_id
            ) nextM ON p.id = nextM.project_id
    GROUP BY p.id, p.number, p.label, p.manager, p.customer, nextM.nextMilestone`;

const findProjectByIdQuery = 'SELECT * FROM projects WHERE id = ?';

const findEmployeesByProjectQuery =
    'SELECT id, name FROM employees WHERE project_id = ? ORDER BY name ASC';

const findMilestonesByProjectQuery =
    'SELECT id, date, label, description FROM milestones WHERE project_id = ? ORDER BY date ASC';

const parseToNumber = (id) => {
    if (id == null) {
        return null;
    }

    if (typeof id == 'string') {
        id = parseInt(id);
    }

    if (typeof id !== 'number' || isNaN(id)) {
        return null;
    }

    return id;
};

const insertProjectQuery = 'INSERT INTO projects SET ?';
const insertEmployeeQuery = 'INSERT INTO employees SET ?';
const insertMilestoneQuery = 'INSERT INTO milestones SET ?';

class ProjectService {
    async get() {
        let projects = await dbConnection.select(getProjectsQuery);
        return projects;
    }

    async find(id) {
        id = parseToNumber(id);
        if (id === null) return null;

        let project = await dbConnection.select(findProjectByIdQuery, [id]);

        if (!project) {
            throw `${id} not found`;
        }

        if (Array.isArray(project)) {
            if (project.length > 1) {
                throw `${id} returns more that one value`;
            }

            if (project.length < 1) {
                throw `${id} not found`;
            }
            project = project[0];
        }

        project.employees = await dbConnection.select(
            findEmployeesByProjectQuery,
            [id]
        );
        project.milestones = await dbConnection.select(
            findMilestonesByProjectQuery,
            [id]
        );
        return project;
    }

    async insert(project) {
        if (project == null) {
            return null;
        }

        if (project.length < 1) {
            return null;
        }

        let employees = project.employees ?? [];
        let milestones = project.milestones ?? [];

        delete project.milestones;
        delete project.employees;

        let projectResult = await dbConnection.insert(
            insertProjectQuery,
            project
        );

        let projectId = projectResult.insertId;

        let insertPromises = [];

        for (let i = 0; i < employees.length; i++) {
            employees[i].project_id = projectId;
            let employeePromise = dbConnection.insert(
                insertEmployeeQuery,
                employees[i]
            );
            insertPromises.push(employeePromise);
        }

        for (let i = 0; i < milestones.length; i++) {
            milestones[i].project_id = projectId;
            let milestonePromise = dbConnection.insert(
                insertMilestoneQuery,
                milestones[i]
            );
            insertPromises.push(milestonePromise);
        }

        await Promise.all(insertPromises);

        return projectId;
    }

    //------------------------------update employee field----------------------------------------------
    update(id, project, success) {
        if (id == null || project == null) {
            return null;
        }

        this.find(id, (error, result) => {
            if (error) {
                return success(error, null);
            }

            let toUpdate = result;

            // TODO map properties
            // --> overwrite old values with new values (map properties)
            // e.g. toUpdate.manager = project.manager, ...
            // DO NOT MAP ID AND NUMBER (they are unchangable)

            dbConnection.select(
                `SELECT id, name FROM employees WHERE project_id = ${id}`,
                (error, employees) => {
                    if (error) {
                        return success(error, null);
                    }

                    let ids = [];
                    for (let i = 0; i < employees.length; i++) {
                        ids.push(employees[i].id);
                    }

                    if (project.employees !== undefined) {
                        for (let i = 0; i < project.employees.length; i++) {
                            if (project.employees[i].id === undefined) {
                                project.employees[i].project_id = id;

                                dbConnection.insert(
                                    'INSERT INTO employees SET ?',
                                    project.employees[i],
                                    () => {}
                                );
                                continue;
                            }

                            let idAsNumber = parseInt(project.employees[i].id);
                            let index = ids.indexOf(idAsNumber);

                            if (index > -1) {
                                ids.splice(index, 1);

                                // check if employee was updated
                                let emp = employees.find((x) => {
                                    return x.id === idAsNumber;
                                });
                                if (emp.name !== project.employees[i].name) {
                                    emp.name = project.employees[i].name;

                                    dbConnection.update(
                                        `UPDATE employees SET ? WHERE id = ${idAsNumber}`,
                                        emp,
                                        () => {}
                                    );
                                }
                            }
                        }

                        if (ids.length > 0) {
                            for (let i = 0; i < ids.length; i++) {
                                dbConnection.delete(
                                    `DELETE FROM employees WHERE id = ${ids[i]}`,
                                    () => {}
                                );
                            }
                        }
                    }
                }
            );

            // TODO 3. add check for milestones (see employees)
            // --> new milestones have no id -> insert them into the database
            // --> go through list of milestone ids and delete milestones
            // that are in the database but weren't in the new project

            //-------------------------------update Milestones field-------------------------------------------

            // dbConnection.select(
            //     `SELECT id, name FROM milestones WHERE project_id = ${id}`,
            //     (error, milestones) => {
            //         if (error) {
            //             return success(error, null);
            //         }
            //
            //         let names_milestones = [];
            //         for (let i = 0; i < milestones.length; i++) {
            //             names_milestones.push(milestones[i].name);
            //         }
            //
            //         for (let i = 0; i < project.employees.length; i++) {
            //             let index = names_milestones.indexOf(
            //                 project.employees[i].name
            //             );
            //             if (index > -1) {
            //                 names_milestones.splice(index, 1);
            //             } else {
            //                 project.employees[i].project_id = id;
            //
            //                 dbConnection.insert(
            //                     'INSERT INTO milestones SET ?',
            //                     project.employees[i],
            //                     () => {}
            //                 );
            //             }
            //         }
            //
            //         if (names_milestones.length > 0) {
            //             for (let i = 0; i < names_milestones.length; i++) {
            //                 dbConnection.delete(
            //                     `DELETE FROM milestones WHERE name = "${names_milestones[i]}" AND project_id = ${id}`,
            //                     () => {}
            //                 );
            //             }
            //         }
            //     }
            // );

            // TODO 4. update project in db
            // dbConnection.update(
            //     `UPDATE projects SET ? WHERE id = ${project.id}`,
            //     toUpdate,
            //     (error, result) => {
            //         if (error) {
            //             return success(error, null);
            //         }
            //         success(null, result.insertedId);
            //     }
            // );

            // TODO remove once implementation is done
            success(null, parseInt(id));
        });
    }
}

module.exports = new ProjectService();
