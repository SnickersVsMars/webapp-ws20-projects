const projectsPath = '/api/projects';

describe('Projects API', () => {
    context('GET /projects', () => {
        it('gets a list of projects', () => {
            cy.request('GET', projectsPath).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body).length.to.be.greaterThan(0);

                for (let project of res.body) {
                    expect(project).to.have.property('number');
                    expect(project).to.have.property('manager');
                    expect(project).to.have.property('label');
                    expect(project).to.have.property('nextMilestone');
                    expect(project).to.have.property('customer');
                }
            });
        });
    });

    context('GET /projects/:id', () => {
        it("gets a project's details", () => {
            cy.request('GET', projectsPath + '/1').then((res) => {
                expect(res.status).to.equal(200);
                let project = res.body;

                expect(project).to.have.property('number');
                expect(project).to.have.property('manager');
                expect(project).to.have.property('customer');
                expect(project).to.have.property('label');
                expect(project).to.have.property('milestones');

                expect(project.milestones).length.to.be.gte(2);
            });
        });

        it('gets error code 404 on invalid or non existant id', () => {
            cy.request({
                method: 'GET',
                url: projectsPath + '/wrong-id',
                failOnStatusCode: false,
            })
                .its('status')
                .should('equal', 404);
        });
    });
});
