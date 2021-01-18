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
}

module.exports = new ProjectService();
