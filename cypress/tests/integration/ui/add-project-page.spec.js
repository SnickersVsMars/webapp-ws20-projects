/// <reference types="Cypress" />

describe('The add project page', () => {
    beforeEach(() => {
        cy.visit('/projects/add');
    });

    it('stays on page on empty form submit', () => {
        cy.contains('Projekt erstellen').click();
        cy.url().should('contain', '/projects/add');
    });

    it('shows all validation errors on empty form submit', () => {
        cy.contains('Projekt erstellen').click();

        cy.get('#input-manager')
            .closest('div')
            .contains('Feld ist verpflichtend. Maximal 50 Zeichen');
        cy.get('#input-customer')
            .closest('div')
            .contains('Feld ist verpflichtend. Maximal 50 Zeichen');
        cy.get('#input-label')
            .closest('div')
            .contains('Feld ist verpflichtend. Maximal 50 Zeichen');
        cy.get('#input-costcenter')
            .closest('div')
            .contains('Feld ist verpflichtend. Maximal 20 Zeichen');
        cy.get('.milestone-date').each((input) => {
            cy.wrap(input).closest('div').contains('Feld ist verpflichtend');
        });
    });

    it('allows to add and remove employee fields', () => {
        cy.get('.input-employee').should('not.exist');
        cy.get('#add-employee').click();
        cy.get('#add-employee').click();
        cy.get('#add-employee').click();
        cy.get('.input-employee').should('have.length', 3);
        cy.get('.remove-button').last().click();
        cy.get('.input-employee').should('have.length', 2);
        cy.get('.remove-button').last().click();
        cy.get('.remove-button').last().click();
        cy.get('.input-employee').should('not.exist');
    });

    it('allows to add and remove milestone fields', () => {
        cy.get('#milestone-container').children('div').should('have.length', 2);
        cy.get('#add-milestone').click();
        cy.get('#add-milestone').click();
        cy.get('#add-milestone').click();
        cy.get('#milestone-container').children('div').should('have.length', 5);
        cy.get('.d-block').last().click();
        cy.get('#milestone-container').children('div').should('have.length', 4);
        cy.get('.d-block').last().click();
        cy.get('.d-block').last().click();
        cy.get('#milestone-container').children('div').should('have.length', 2);
    });

    it('has project start and end', () => {
        cy.get('.milestone-label')
            .first()
            .should('have.value', 'Projekt Start')
            .should('have.attr', 'readonly');
        cy.get('.milestone-label')
            .last()
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

    it('can add a minimal project', () => {
        let start = '2020-12-18';
        let end = '2021-01-21';

        cy.get('#input-manager')
            .type('Max Manager')
            .should('have.value', 'Max Manager');
        cy.get('#input-customer')
            .type('Karl Kunde')
            .should('have.value', 'Karl Kunde');
        cy.get('#input-label')
            .type('Automatisches Projekt')
            .should('have.value', 'Automatisches Projekt');
        cy.get('#input-costcenter').type('QA').should('have.value', 'QA');
        cy.get('.milestone-date').each((input, i) => {
            if (i === 0) {
                cy.wrap(input).type(start);
            } else {
                cy.wrap(input).type(end);
            }
        });

        cy.contains('Projekt erstellen').click();

        cy.intercept('POST', '/projects', (req) => {
            req.reply((res) => {
                expect(typeof res.body).to.equal('number');
            });
        });

        cy.url().should('not.contain', 'add');
    });

    it('can add a full project', () => {
        let start = '2020-12-18';
        let end = '2021-01-21';
        let plan = '2021-01-04';
        let implement = '2021-01-18';

        cy.get('#input-manager')
            .type('Max Manager')
            .should('have.value', 'Max Manager');
        cy.get('#input-customer')
            .type('Franz Follwertig')
            .should('have.value', 'Franz Follwertig');
        cy.get('#input-label')
            .type('Vollwertiges Projekt')
            .should('have.value', 'Vollwertiges Projekt');
        cy.get('#input-costcenter').type('QA').should('have.value', 'QA');
        cy.get('#input-description')
            .type(
                'Dieses Projekt dient dazu, zu testen, ob ein vollerwertiges Projekt mit mehreren Mitarbeitern und Meilensteinen und allen Feldern ausgefüllt angelegt werden kann.'
            )
            .should(
                'have.value',
                'Dieses Projekt dient dazu, zu testen, ob ein vollerwertiges Projekt mit mehreren Mitarbeitern und Meilensteinen und allen Feldern ausgefüllt angelegt werden kann.'
            );

        cy.get('#add-employee').click();
        cy.get('.input-employee')
            .type('Moritz Mitarbeiter')
            .should('have.value', 'Moritz Mitarbeiter');
        cy.get('#add-employee').click();
        cy.get('.input-employee')
            .last()
            .type('Alex Anderer-Mitarbeiter')
            .should('have.value', 'Alex Anderer-Mitarbeiter');
        cy.get('#add-employee').click();
        cy.get('.input-employee')
            .last()
            .type('Dieter Der-Dritte')
            .should('have.value', 'Dieter Der-Dritte');

        cy.get('.milestone-description')
            .first()
            .type('Start des Projekts')
            .should('have.value', 'Start des Projekts');
        cy.get('.milestone-description')
            .last()
            .type('Ende des Projekts')
            .should('have.value', 'Ende des Projekts');

        cy.get('#add-milestone').click();
        cy.get('.milestone-label')
            .last()
            .type('Planungsabschluss')
            .should('have.value', 'Planungsabschluss');
        cy.get('.milestone-description')
            .last()
            .type('Abschluss Planungsphase')
            .should('have.value', 'Abschluss Planungsphase');
        cy.get('#add-milestone').click();
        cy.get('.milestone-label')
            .last()
            .type('Umsetzungsabschluss')
            .should('have.value', 'Umsetzungsabschluss');
        cy.get('.milestone-description')
            .last()
            .type('Abschluss der Umsetzungsphase')
            .should('have.value', 'Abschluss der Umsetzungsphase');

        cy.get('.milestone-date').each((input, i) => {
            switch (i) {
                case 0:
                    cy.wrap(input).type(start);
                    break;
                case 1:
                    cy.wrap(input).type(end);
                    break;
                case 2:
                    cy.wrap(input).type(plan);
                    break;
                case 3:
                    cy.wrap(input).type(implement);
                    break;
            }
        });

        cy.contains('Projekt erstellen').click();

        cy.intercept('POST', '/projects', (req) => {
            req.reply((res) => {
                expect(typeof res.body).to.equal('number');
            });
        });

        cy.url().should('not.contain', 'add');
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
