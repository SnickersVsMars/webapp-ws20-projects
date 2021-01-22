const projectsPath = '/api/projects';
const id = 1;

describe('Projects API', () => {
    context('PUT /projects/:id', () => {
        it('gets edited ID on committing update', () => {
            cy.request('GET', `${projectsPath}/${id}`).then((res) => {
                cy.request('PUT', `${projectsPath}/${id}`, res.body).then(
                    (res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.equal(id);
                    }
                );
            });
        });

        it('has the updated properties after edit', () => {
            // add new test project to work with
            let createdId;
            let body = {
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                description: 'Beschreibung',
                employees: [
                    { name: 'Thomas Test' },
                    { name: 'Peter Probe' },
                    { name: 'Ines Integration' },
                ],
                milestones: [
                    { date: '2020-11-02', label: 'Projekt Start' },
                    { date: '2020-11-30', label: 'Sprint 1 Ende' },
                    { date: '2020-12-21', label: 'Sprint 2 Ende' },
                    { date: '2021-01-25', label: 'Projekt Ende' },
                ],
            };

            cy.request('POST', '/api/projects/', body)
                .then((res) => {
                    expect(res.status).to.equal(201);
                    expect(typeof res.body).to.equal('number');
                    createdId = res.body;
                })
                .then(() => {
                    let editBody = {
                        id: createdId,
                        manager: 'Editmanager',
                        customer: 'Editcustomer',
                        label: 'Editlabel',
                        costCenter: 'EditCostCenter',
                        description: 'EditDescription',
                        employees: [
                            { name: 'Eric Edit' },
                            { name: 'Basti Bearbeitet' },
                        ],
                        milestones: [
                            {
                                date: '2021-02-02',
                                label: 'Projekt Start',
                                description: 'Projektstart',
                            },
                            {
                                date: '2021-02-18',
                                label: 'Edit Milestone',
                                description: 'Editmeilenstein',
                            },
                            {
                                date: '2021-03-31',
                                label: 'Projekt Ende',
                                description: 'Projektende',
                            },
                        ],
                    };

                    cy.request(
                        'PUT',
                        `${projectsPath}/${createdId}`,
                        editBody
                    ).then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.equal(createdId);

                        cy.request('GET', `${projectsPath}/${createdId}`).then(
                            (res) => {
                                expect(res.status).to.equal(200);
                                let project = res.body;

                                expect(project).to.have.property(
                                    'id',
                                    createdId
                                );
                                expect(project).to.have.property('number');
                                expect(project).to.have.property(
                                    'manager',
                                    'Editmanager'
                                );
                                expect(project).to.have.property(
                                    'customer',
                                    'Editcustomer'
                                );
                                expect(project).to.have.property(
                                    'label',
                                    'Editlabel'
                                );
                                expect(project).to.have.property(
                                    'description',
                                    'EditDescription'
                                );

                                expect(project).to.have.property('employees');
                                expect(project.employees).to.have.length(2);
                                for (
                                    let i = 0;
                                    i < project.employees.length;
                                    i++
                                ) {
                                    expect(
                                        project.employees[i]
                                    ).to.have.property('id');
                                    project.employees[i].name =
                                        editBody.employees[i].name;
                                }
                                expect(project).to.have.property('milestones');
                                expect(project.milestones).to.have.length(3);
                                for (
                                    let i = 0;
                                    i < project.milestones.length;
                                    i++
                                ) {
                                    expect(
                                        project.milestones[i]
                                    ).to.have.property('id');
                                    project.milestones[i].date =
                                        editBody.milestones[i].date;
                                    project.milestones[i].label =
                                        editBody.milestones[i].label;
                                    project.milestones[i].description =
                                        editBody.milestones[i].description;
                                }
                            }
                        );
                    });
                });
        });

        it('gets 400 on empty body', () => {
            cy.request({
                method: 'PUT',
                url: `${projectsPath}/${id}`,
                body: {},
                failOnStatusCode: false,
            })
                .its('status')
                .should('equal', 400);
        });

        it('gets 400 on invalid milesone dates', () => {
            let body = {
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
                method: 'PUT',
                url: `${projectsPath}/${id}`,
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

        it('gets 400 and wrong format error text on text instead of date', () => {
            let body = {
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                milestones: [{ date: 'wrong-date', label: 'Projekt Start' }],
            };

            cy.request({
                method: 'PUT',
                url: `${projectsPath}/${id}`,
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
                expect(res.body.errors).to.have.property(
                    'milestones[0].date',
                    'Format nicht korrekt, bitte Format JJJJ-MM-TT verwenden. Eingabedatum muss zwischen 1990-01-01 und 2099-12-31 liegen.'
                );
            });
        });

        it('gets 400 and wrong format error text on wrong numerical date format', () => {
            let body = {
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                milestones: [
                    {
                        date: '123456789-123456789-123456789',
                        label: 'Projekt Start',
                    },
                ],
            };

            cy.request({
                method: 'PUT',
                url: `${projectsPath}/${id}`,
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
                expect(res.body.errors).to.have.property(
                    'milestones[0].date',
                    'Format nicht korrekt, bitte Format JJJJ-MM-TT verwenden. Eingabedatum muss zwischen 1990-01-01 und 2099-12-31 liegen.'
                );
            });
        });

        it('gets 400 and wrong format error text on date before 1990', () => {
            let body = {
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                milestones: [
                    {
                        date: '1989-12-31',
                        label: 'Projekt Start',
                    },
                ],
            };

            cy.request({
                method: 'PUT',
                url: `${projectsPath}/${id}`,
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
                expect(res.body.errors).to.have.property(
                    'milestones[0].date',
                    'Format nicht korrekt, bitte Format JJJJ-MM-TT verwenden. Eingabedatum muss zwischen 1990-01-01 und 2099-12-31 liegen.'
                );
            });
        });

        it('gets 400 and wrong format error text on date before 2099', () => {
            let body = {
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                milestones: [
                    {
                        date: '3000-01-01',
                        label: 'Projekt Start',
                    },
                ],
            };

            cy.request({
                method: 'PUT',
                url: `${projectsPath}/${id}`,
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
                expect(res.body.errors).to.have.property(
                    'milestones[0].date',
                    'Format nicht korrekt, bitte Format JJJJ-MM-TT verwenden. Eingabedatum muss zwischen 1990-01-01 und 2099-12-31 liegen.'
                );
            });
        });

        it('gets 400 and wrong format error text on day higher than 31', () => {
            let body = {
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                milestones: [
                    {
                        date: '2021-01-32',
                        label: 'Projekt Start',
                    },
                    {
                        date: '2021-01-41',
                        label: 'Projekt Ende',
                    },
                ],
            };

            cy.request({
                method: 'PUT',
                url: `${projectsPath}/${id}`,
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
                expect(res.body.errors).to.have.property(
                    'milestones[0].date',
                    'Format nicht korrekt, bitte Format JJJJ-MM-TT verwenden. Eingabedatum muss zwischen 1990-01-01 und 2099-12-31 liegen.'
                );
                expect(res.body.errors).to.have.property(
                    'milestones[1].date',
                    'Format nicht korrekt, bitte Format JJJJ-MM-TT verwenden. Eingabedatum muss zwischen 1990-01-01 und 2099-12-31 liegen.'
                );
            });
        });

        it('gets 400 and wrong format error text on month higher than 12', () => {
            let body = {
                manager: 'Testmanager',
                customer: 'Testcustomer',
                label: 'Testlabel',
                costCenter: 'TestCostCenter',
                milestones: [
                    {
                        date: '2021-13-01',
                        label: 'Projekt Start',
                    },
                    {
                        date: '2021-21-41',
                        label: 'Projekt Ende',
                    },
                ],
            };

            cy.request({
                method: 'PUT',
                url: `${projectsPath}/${id}`,
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
                expect(res.body.errors).to.have.property(
                    'milestones[0].date',
                    'Format nicht korrekt, bitte Format JJJJ-MM-TT verwenden. Eingabedatum muss zwischen 1990-01-01 und 2099-12-31 liegen.'
                );
                expect(res.body.errors).to.have.property(
                    'milestones[1].date',
                    'Format nicht korrekt, bitte Format JJJJ-MM-TT verwenden. Eingabedatum muss zwischen 1990-01-01 und 2099-12-31 liegen.'
                );
            });
        });

        it('gets 400 and required error texts on missing values', () => {
            let body = {
                manager: '',
                customer: '',
                label: '',
                costCenter: '',
                milestones: [],
            };

            cy.request({
                method: 'PUT',
                url: `${projectsPath}/${id}`,
                body: body,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.equal(400);
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
