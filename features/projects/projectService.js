const dbConnection = require('../dbConnection');

const getProjectsQuery = `
SELECT p.id, p.number, p.label, p.manager, p.customer, nextM.nextMilestone, IF(e.employeeCount IS NULL,0,e.employeeCount) AS employeeCount,  IF(f.fileCount IS NULL,0,f.fileCount) AS fileCount
FROM projects p
	LEFT OUTER JOIN (SELECT project_id, COUNT(*) AS employeeCount FROM employees GROUP BY project_id) e ON p.id=e.project_id
   LEFT OUTER JOIN (SELECT project_id, COUNT(*) AS fileCount FROM files GROUP BY project_id) f ON p.id = f.project_id
	LEFT OUTER JOIN
   	(
      	SELECT m.project_id AS project_id, MIN(m.date) AS nextMilestone
         FROM milestones m
         WHERE m.date >= CURRENT_DATE()
         GROUP BY m.project_id
      ) nextM ON p.id = nextM.project_id
GROUP BY p.id, p.number, p.label, p.manager, p.customer, nextM.nextMilestone;`;

const findProjectByIdQuery = 'SELECT * FROM projects WHERE id = ?';

const findEmployeesByProjectQuery =
    'SELECT id, name FROM employees WHERE project_id = ? ORDER BY name ASC';

const findMilestonesByProjectQuery =
    'SELECT id, date, label, description FROM milestones WHERE project_id = ? ORDER BY date ASC';

const findFilesByProjectQuery =
    'SELECT id, filename, project_id FROM files WHERE project_id = ? ORDER BY id ASC';

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

const updateProjectQuery = 'UPDATE projects SET ? WHERE id = ?';
const updateEmployeeQuery = 'UPDATE employees SET ? WHERE id = ?';
const updateMilestoneQuery = 'UPDATE milestones SET ? WHERE id = ?';

const deleteEmployeeQuery = 'DELETE FROM employees WHERE id = ?';
const deleteMilestoneQuery = 'DELETE FROM milestones WHERE id = ?';

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
        project.files = await dbConnection.select(findFilesByProjectQuery, [
            id,
        ]);

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
        delete project.files;

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

    async update(id, project) {
        if (id == null || project == null) {
            return null;
        }
        let dbProject = await this.find(id);

        let employees = project.employees ?? [];
        let dbEmployees = dbProject.employees ?? [];
        let milestones = project.milestones ?? [];
        let dbMilestones = dbProject.milestones ?? [];

        delete dbProject.employees;
        delete dbProject.files;
        delete dbProject.milestones;

        dbProject.manager = project.manager ?? null;
        dbProject.label = project.label ?? null;
        dbProject.description = project.description ?? null;
        dbProject.customer = project.customer ?? null;
        dbProject.costCenter = project.costCenter ?? null;
        dbProject.lastChanged = new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

        await dbConnection.update(updateProjectQuery, [
            dbProject,
            parseInt(id),
        ]);

        await this.updateEmployees(dbEmployees, employees, id);

        await this.updateMilestones(dbMilestones, milestones, id);

        return parseInt(id);
    }

    async updateEmployees(dbEmployees, employees, id) {
        let ids = [];

        for (let i = 0; i < dbEmployees.length; i++) {
            ids.push(dbEmployees[i].id);
        }

        for (let i = 0; i < employees.length; i++) {
            if (employees[i].id === undefined) {
                employees[i].project_id = id;

                await dbConnection.insert(insertEmployeeQuery, employees[i]);

                continue;
            }

            let idAsNumber = parseInt(employees[i].id);
            let index = ids.indexOf(idAsNumber);

            if (index > -1) {
                ids.splice(index, 1);

                let emp = dbEmployees.find((x) => {
                    return x.id === idAsNumber;
                });
                if (emp.name !== employees[i].name) {
                    emp.name = employees[i].name;

                    await dbConnection.update(updateEmployeeQuery, [
                        emp,
                        idAsNumber,
                    ]);
                }
            }
        }

        if (ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                await dbConnection.delete(deleteEmployeeQuery, [ids[i]]);
            }
        }
    }

    async updateMilestones(dbMilestones, milestones, id) {
        let ids = [];

        for (let i = 0; i < dbMilestones.length; i++) {
            ids.push(dbMilestones[i].id);
        }

        for (let i = 0; i < milestones.length; i++) {
            if (milestones[i].id === undefined) {
                milestones[i].project_id = id;

                await dbConnection.insert(insertMilestoneQuery, milestones[i]);

                continue;
            }

            let idAsNumber = parseInt(milestones[i].id);
            let index = ids.indexOf(idAsNumber);

            if (index > -1) {
                ids.splice(index, 1);

                let mile = dbMilestones.find((x) => {
                    return x.id === idAsNumber;
                });

                let changed = false;

                if (mile.date !== milestones[i].date) {
                    mile.date = milestones[i].date;
                    changed = true;
                }

                if (mile.label !== milestones[i].label) {
                    mile.label = milestones[i].label;
                    changed = true;
                }

                if (mile.description !== milestones[i].description) {
                    mile.description = milestones[i].description;
                    changed = true;
                }

                if (changed) {
                    await dbConnection.update(updateMilestoneQuery, [
                        mile,
                        idAsNumber,
                    ]);
                }
            }
        }

        if (ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                await dbConnection.delete(deleteMilestoneQuery, [ids[i]]);
            }
        }
    }
}

module.exports = new ProjectService();
