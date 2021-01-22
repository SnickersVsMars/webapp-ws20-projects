/// <reference types="Cypress" />

describe('The add project page', () => {
    context('with a stubbed project', () => {
        beforeEach(() => {
            cy.intercept('GET', /\/api\/projects\/\d*/, {
                fixture: 'project.json',
            }).as('findProject');
            cy.intercept('PUT', /\/api\/projects\/\d*/, {
                fixture: 'edit-project.json',
            }).as('putProject');

            cy.visit('/projects/1/edit/');
            cy.wait('@findProject');
        });

        it('redirects to detail on submit', () => {
            cy.contains('Speichern').click();
            cy.url().should('contain', '/projects/1');
            cy.url().should('not.contain', 'edit');
        });

        it('fills inputs with existing values', () => {
            cy.get('#projectId').should('be.hidden');
            cy.get('#projectId').should('have.value', '1');
            cy.get('#input-number').should('have.value', 'PR20-0001');
            cy.get('#input-label').should('have.value', 'Test-Projekt 1');
            cy.get('#input-description').should(
                'have.value',
                'Das ist das erste Test-Projekt.'
            );
            cy.get('#input-manager').should('have.value', 'Christian Sitzwohl');
            cy.get('#input-customer').should('have.value', 'FH Joanneum');
            cy.get('#input-cost-center').should('have.value', 'Intern');

            cy.get('#last-change-text').contains('2021');
            cy.get('#last-change-text').contains('01');
            cy.get('#last-change-text').contains('19');

            cy.get('#breadcrumb').contains('PROJEKT PR20-0001');
            cy.get('#breadcrumb').should('have.attr', 'href', '/projects/1');

            cy.get('#employee-container')
                .children('.added-employee')
                .each(($emp, i) => {
                    switch (i) {
                        case 0:
                            cy.wrap($emp)
                                .children('.input-employee')
                                .should('have.value', 'Michael Lamprecht');
                            cy.wrap($emp)
                                .children('input:hidden')
                                .should('have.value', '1');
                            break;
                        case 1:
                            cy.wrap($emp)
                                .children('.input-employee')
                                .should('have.value', 'Marian Korosec');
                            cy.wrap($emp)
                                .children('input:hidden')
                                .should('have.value', '2');
                            break;
                        case 2:
                            cy.wrap($emp)
                                .children('.input-employee')
                                .should('have.value', 'Samuel Angerer');
                            cy.wrap($emp)
                                .children('input:hidden')
                                .should('have.value', '3');
                            break;
                    }
                });

            cy.get('#milestone-container')
                .children('.card-body')
                .each(($milestone, i) => {
                    switch (i) {
                        case 0:
                            cy.wrap($milestone)
                                .contains('Datum')
                                .siblings('.milestone-date')
                                .should('have.attr', 'type', 'date');
                            cy.wrap($milestone)
                                .contains('Bezeichnung')
                                .siblings('.milestone-label')
                                .should('have.value', 'Projekt Start');
                            cy.wrap($milestone)
                                .contains('Beschreibung')
                                .siblings('.milestone-description')
                                .should('have.value', 'Projektstart');
                            cy.wrap($milestone)
                                .find('input:hidden')
                                .should('have.value', '2');
                            break;
                        case 1:
                            cy.wrap($milestone)
                                .contains('Datum')
                                .siblings('.milestone-date')
                                .should('have.attr', 'type', 'date');
                            cy.wrap($milestone)
                                .contains('Bezeichnung')
                                .siblings('.milestone-label')
                                .should('have.value', 'Projekt Ende');
                            cy.wrap($milestone)
                                .contains('Beschreibung')
                                .siblings('.milestone-description')
                                .should('have.value', 'Projektabschluss');
                            cy.wrap($milestone)
                                .find('input:hidden')
                                .should('have.value', '3');
                            break;
                        case 2:
                            cy.wrap($milestone)
                                .contains('Datum')
                                .siblings('.milestone-date')
                                .should('have.attr', 'type', 'date');
                            cy.wrap($milestone)
                                .contains('Bezeichnung')
                                .siblings('.milestone-label')
                                .should('have.value', 'Kick-off');
                            cy.wrap($milestone)
                                .contains('Beschreibung')
                                .siblings('.milestone-description')
                                .should('have.value', 'Kick-off Meeting');
                            cy.wrap($milestone)
                                .find('input:hidden')
                                .should('have.value', '1');
                            break;
                    }
                });
        });

        it('attempting to delete employee shows alert', () => {
            const stub = cy.stub();
            stub.onFirstCall().returns(false);
            cy.on('window:confirm', stub);

            cy.get('#employee-container').find('.input-employee').as('input');

            cy.get('@input').should('have.value', 'Michael Lamprecht');

            cy.get('#employee-container')
                .find('.remove-button')
                .first()
                .click()
                .then(() => {
                    cy.expect(stub.getCall(0)).to.be.calledWith(
                        'Wollen Sie den Mitarbeiter wirklich löschen?'
                    );
                });

            cy.get('@input').should('have.value', 'Michael Lamprecht');
        });

        it('attempting to delete milestone shows alert', () => {
            const stub = cy.stub();
            stub.onFirstCall().returns(false);
            cy.on('window:confirm', stub);

            cy.wait(2000);

            cy.get('#milestone-container')
                .find('.milestone-label')
                .last()
                .as('label');

            cy.get('@label').should('have.value', 'Kick-off');

            cy.get('#milestone-container')
                .find('.remove-button')
                .first()
                .click()
                .then(() => {
                    cy.expect(stub.getCall(0)).to.be.calledWith(
                        'Wollen Sie diesen Meilenstein wirklich löschen?'
                    );
                });

            cy.get('@label').should('have.value', 'Kick-off');
        });

        it('confirming to delete employee deletes it', () => {
            const stub = cy.stub();
            stub.onFirstCall().returns(true);
            cy.on('window:confirm', stub);

            cy.get('#employee-container').find('.input-employee').as('input');

            cy.get('@input').should('have.value', 'Michael Lamprecht');

            cy.get('#employee-container')
                .find('.remove-button')
                .first()
                .click()
                .then(() => {
                    cy.expect(stub.getCall(0)).to.be.calledWith(
                        'Wollen Sie den Mitarbeiter wirklich löschen?'
                    );
                });

            cy.get('@input').should('not.have.value', 'Michael Lamprecht');
        });

        it('confirming to delete milestone deletes it', () => {
            const stub = cy.stub();
            stub.onFirstCall().returns(true);
            cy.on('window:confirm', stub);

            cy.wait(2000);

            cy.get('#milestone-container')
                .find('.milestone-label')
                .last()
                .as('label');

            cy.get('@label').should('have.value', 'Kick-off');

            cy.get('#milestone-container')
                .find('.remove-button')
                .first()
                .click()
                .then(() => {
                    cy.expect(stub.getCall(0)).to.be.calledWith(
                        'Wollen Sie diesen Meilenstein wirklich löschen?'
                    );
                });

            cy.get('@label').should('not.have.value', 'Kick-off');
        });

        it('shows all validation errors on empty form submit', () => {
            cy.get('.remove-button').each(($btn) => {
                cy.wrap($btn).click();
            });

            cy.get('#input-label').clear();
            cy.get('#input-description').clear();
            cy.get('#input-manager').clear();
            cy.get('#input-customer').clear();
            cy.get('#input-cost-center').clear();

            cy.contains('Speichern').click();

            cy.get('#input-manager')
                .closest('div')
                .contains('Feld ist verpflichtend. Maximal 50 Zeichen');
            cy.get('#input-customer')
                .closest('div')
                .contains('Feld ist verpflichtend. Maximal 50 Zeichen');
            cy.get('#input-label')
                .closest('div')
                .contains('Feld ist verpflichtend. Maximal 50 Zeichen');
            cy.get('#input-cost-center')
                .closest('div')
                .contains('Feld ist verpflichtend. Maximal 20 Zeichen');
            cy.get('.milestone-date').each((input) => {
                cy.wrap(input)
                    .closest('div')
                    .contains('Feld ist verpflichtend');
            });
        });

        it('allows to add employee fields', () => {
            cy.get('.input-employee').should('have.length', 3);
            cy.get('#add-employee').click();
            cy.get('#add-employee').click();
            cy.get('#add-employee').click();
            cy.get('.input-employee').should('have.length', 6);
        });

        it('allows to add milestone fields', () => {
            cy.get('#milestone-container')
                .children('div')
                .should('have.length', 3);
            cy.get('#add-milestone').click();
            cy.get('#add-milestone').click();
            cy.get('#add-milestone').click();
            cy.get('#milestone-container')
                .children('div')
                .should('have.length', 6);
        });

        it('has project start and end', () => {
            cy.get('.milestone-label')
                .first()
                .should('have.value', 'Projekt Start')
                .should('have.attr', 'readonly');
            cy.get('.milestone-label')
                .eq(1)
                .should('have.value', 'Projekt Ende')
                .should('have.attr', 'readonly');
        });

        it('shows max length error messages on too long description', () => {
            cy.get('#input-description').as('descriptionField');

            cy.get('@descriptionField')
                .type(random(501))
                .then((field) => {
                    field = field.get();
                    if (field.length > 250) {
                        cy.contains('Projekt erstellen').click();

                        cy.get('@descriptionField')
                            .closest('div')
                            .contains('Maximal 500 Zeichen');
                    } else {
                        expect(field[0].value).to.have.length(500);
                    }
                });
        });

        it('shows max length error messages on too long milestone description', () => {
            cy.get('.milestone-description').each((input) => {
                cy.wrap(input)
                    .type(random(251))
                    .then((field) => {
                        field = field.get();

                        if (field.length > 250) {
                            cy.contains('Projekt erstellen').click();

                            cy.get('.milestone-description').each((input) => {
                                cy.wrap(input)
                                    .closest('div')
                                    .contains('Maximal 250 Zeichen');
                            });
                        } else {
                            expect(field[0].value).to.have.length(250);
                        }
                    });
            });
        });
    });

    context('with a test project', () => {
        let id;

        beforeEach(() => {
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
                    id = res.body;
                })
                .then(() => {
                    cy.visit(`/projects/${id}/edit/`);
                });
        });

        it('can edit project base info', () => {
            let number;
            let manager = 'Thomas Test';
            let customer = 'Charly Customer';
            let label = 'Updated';
            let costCenter = 'Inter';
            let description = 'Updated Beschreibung';
            let changed = new Date(Date.now());

            cy.wait(2000);

            cy.get('#input-number').then(($input) => {
                number = $input.val();

                cy.get('#input-manager')
                    .clear()
                    .type(manager)
                    .should('have.value', manager);
                cy.get('#input-customer')
                    .clear()
                    .type(customer)
                    .should('have.value', customer);
                cy.get('#input-label')
                    .clear()
                    .type(label)
                    .should('have.value', label);
                cy.get('#input-cost-center')
                    .clear()
                    .type(costCenter)
                    .should('have.value', costCenter);
                cy.get('#input-description')
                    .clear()
                    .type(description)
                    .should('have.value', description);

                cy.contains('Speichern').click();

                cy.wait(2000);

                cy.url().should('contain', `/projects/${id}`);
                cy.url().should('not.contain', 'edit');

                cy.get('#number').contains(number);
                cy.get('#label').contains(label);
                cy.get('#description').contains(description);
                cy.get('#manager').contains(manager);
                cy.get('#customer').contains(customer);
                cy.get('#cost-center').contains(costCenter);

                cy.get('#last-change-text').contains(changed.getFullYear());
                cy.get('#last-change-text').contains(changed.getMonth());
                cy.get('#last-change-text').contains(changed.getDate());

                cy.get('#breadcrumb').contains('PROJEKT ' + number);
                cy.get('#breadcrumb').should(
                    'have.attr',
                    'href',
                    '/projects/' + id
                );
            });
        });

        it('can edit employees of a project', () => {
            let changed = new Date(Date.now());

            // wait for project from server
            cy.wait(2000);

            for (let i = 0; i < 2; i++) {
                cy.get('#employee-container')
                    .find('.remove-button')
                    .last()
                    .click();
            }

            cy.get('#add-employee').click();

            cy.get('.input-employee').each(($input, i) => {
                cy.wrap($input)
                    .clear()
                    .type('Test User ' + i);
            });

            cy.contains('Speichern').click();

            cy.wait(2000);

            cy.url().should('contain', `/projects/${id}`);
            cy.url().should('not.contain', 'edit');

            cy.get('#employees').children('li').should('have.length', 2);
            cy.get('#employees')
                .children('li')
                .each(($emp, i) => {
                    cy.wrap($emp).contains('Test User ' + i);
                });

            cy.get('#last-change-text').contains(changed.getFullYear());
            cy.get('#last-change-text').contains(changed.getMonth());
            cy.get('#last-change-text').contains(changed.getDate());
        });

        it('can edit milestones of a project', () => {
            let start = '2020-11-01';
            let startDesc = 'Updated Projektstart';
            let milestone = '2020-12-21';
            let milestoneDesc = 'Updated Meilenstein';
            let milestoneLabel = 'Meilenstein';
            let end = '2021-01-25';
            let endDesc = 'Updated Projektende';
            let changed = new Date(Date.now());

            cy.wait(2000);

            for (let i = 0; i < 2; i++) {
                cy.get('#milestone-container')
                    .find('.remove-button')
                    .last()
                    .click();
            }

            cy.get('#add-milestone').click();

            cy.get('.milestone-date').each((input, i) => {
                switch (i) {
                    case 0:
                        cy.wrap(input).clear().type(start);
                        break;
                    case 1:
                        cy.wrap(input).clear().type(end);
                        break;
                    case 2:
                        cy.wrap(input).clear().type(milestone);
                        break;
                }
            });
            cy.get('.milestone-description').each((textarea, i) => {
                switch (i) {
                    case 0:
                        cy.wrap(textarea).clear().type(startDesc);
                        break;
                    case 1:
                        cy.wrap(textarea).clear().type(endDesc);
                        break;
                    case 2:
                        cy.wrap(textarea).clear().type(milestoneDesc);
                        break;
                }
            });

            cy.get('.milestone-label').last().clear().type(milestoneLabel);

            cy.contains('Speichern').click();

            cy.wait(2000);

            cy.url().should('contain', `/projects/${id}`);
            cy.url().should('not.contain', 'edit');

            cy.get('#table-milestone-body')
                .children('tr')
                .should('have.length', 3);

            cy.get('#table-milestone-body')
                .children('tr')
                .each(($row, i) => {
                    switch (i) {
                        case 0:
                            cy.wrap($row)
                                .children('td')
                                .first()
                                .contains('2020');
                            cy.wrap($row)
                                .children('td')
                                .eq(1)
                                .contains('Projekt Start');
                            cy.wrap($row)
                                .children('td')
                                .last()
                                .contains(startDesc);
                            break;
                        case 1:
                            cy.wrap($row)
                                .children('td')
                                .first()
                                .contains('2020');
                            cy.wrap($row)
                                .children('td')
                                .eq(1)
                                .contains(milestoneLabel);
                            cy.wrap($row)
                                .children('td')
                                .last()
                                .contains(milestoneDesc);
                            break;
                        case 2:
                            cy.wrap($row)
                                .children('td')
                                .first()
                                .contains('2021');
                            cy.wrap($row)
                                .children('td')
                                .eq(1)
                                .contains('Projekt Ende');
                            cy.wrap($row)
                                .children('td')
                                .last()
                                .contains(endDesc);
                            break;
                    }
                });

            cy.get('#last-change-text').contains(changed.getFullYear());
            cy.get('#last-change-text').contains(changed.getMonth());
            cy.get('#last-change-text').contains(changed.getDate());
        });
    });
});

const random = (length) => {
    let chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Pick characters randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
};
