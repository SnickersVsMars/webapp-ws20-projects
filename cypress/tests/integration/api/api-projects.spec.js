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

    context('POST /projects/', () => {
        it('gets an ID on add project', () => {
            let body = {
                number: 'PR20-0000',
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                milestones: [
                    { date: '2020-12-16', label: 'Projekt Start' },
                    { date: '2021-01-16', label: 'Projekt Ende' },
                ],
            };

            cy.request('POST', projectsPath + '/', body).then((res) => {
                expect(res.status).to.equal(201);
                expect(typeof res.body).to.equal('number');
            });
        });

        it('gets 400 on empty body', () => {
            cy.request({
                method: 'POST',
                url: projectsPath + '/',
                body: {},
                failOnStatusCode: false,
            })
                .its('status')
                .should('equal', 400);
        });

        it('gets 400 on invalid milesone dates', () => {
            let body = {
                number: 'PR20-0000',
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                milestones: [
                    { date: '2021-01-16', label: 'Projekt Start' },
                    { date: '2020-12-16', label: 'Projekt Ende' },
                ],
            };

            cy.request({
                method: 'POST',
                url: projectsPath + '/',
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
                expect(res.body.errors).to.have.property(
                    'milestones',
                    'Meilenstein "Projekt Start" muss vor Meilenstein "Projekt Ende" liegen'
                );
            });
        });

        it('gets 400 and wrong format error text on invalid project format', () => {
            let body = {
                number: 'invalid_format_for_project',
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                milestones: [
                    { date: '2020-12-16', label: 'Projekt Start' },
                    { date: '2021-01-16', label: 'Projekt Ende' },
                ],
            };

            cy.request({
                method: 'POST',
                url: projectsPath + '/',
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
                expect(res.body.errors).to.have.property(
                    'number',
                    'Bitte folgendes Format verwenden: PR20_xxxx'
                );
            });
        });

        it('gets 400 and wrong format error text on invalid date format', () => {
            let body = {
                number: 'PR20-0000',
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                milestones: [{ date: 'wrong-date', label: 'Projekt Start' }],
            };

            cy.request({
                method: 'POST',
                url: projectsPath + '/',
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
                expect(res.body.errors).to.have.property(
                    'milestones[0].date',
                    'Format nicht korrekt, bitte JJJJ-MM-TT verwenden'
                );
            });
        });

        it('gets 400 and required error texts on missing values', () => {
            let body = {
                number: '',
                manager: '',
                customer: '',
                label: '',
                costCenter: '',
                milestones: [],
            };

            cy.request({
                method: 'POST',
                url: projectsPath + '/',
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
                expect(res.body.errors).to.have.property(
                    'number',
                    'Bitte Projektnummer eintragen'
                );
                expect(res.body.errors).to.have.property(
                    'manager',
                    'Bitte Namen der zuständigen Person eintragen'
                );
                expect(res.body.errors).to.have.property(
                    'customer',
                    'Bitte Namen des Kunden eintragen'
                );
                expect(res.body.errors).to.have.property(
                    'label',
                    'Bitte Bezeichnung eintragen'
                );
                expect(res.body.errors).to.have.property(
                    'costCenter',
                    'Bitte zuständige Kostenstelle eintragen'
                );
                expect(res.body.errors).to.have.property(
                    'milestones',
                    '"Projekt Start" und "Projekt Ende" Meilensteine sind verplichtend'
                );
            });
        });
    });
});
