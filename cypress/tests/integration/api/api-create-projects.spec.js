const projectsPath = '/api/projects';

describe('Projects API', () => {
    context('POST /projects/', () => {
        it('gets an ID on add project', () => {
            let body = {
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

        it('gets 400 and wrong format error text on text instead of date', () => {
            let body = {
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
                method: 'POST',
                url: projectsPath + '/',
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
                method: 'POST',
                url: projectsPath + '/',
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
                method: 'POST',
                url: projectsPath + '/',
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
                method: 'POST',
                url: projectsPath + '/',
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
                method: 'POST',
                url: projectsPath + '/',
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
                method: 'POST',
                url: projectsPath + '/',
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
