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

        cy.get('#input-number')
            .closest('div')
            .contains(
                'Feld ist verpflichtend. Folgendes Format verwenden: PR20-0001'
            );
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

    it('shows format error on wrong project format', () => {
        cy.get('#input-number')
            .type('i-am-invalid')
            .should('have.value', 'i-am-invalid');

        cy.contains('Projekt erstellen').click();

        cy.contains('Format verwenden: PR20-0001');
    });

    it('allows to add and remove employee fields', () => {
        cy.get('.input-employee').should('not.exist');
        cy.get('#add-employee').click();
        cy.get('#add-employee').click();
        cy.get('#add-employee').click();
        cy.get('.input-employee').then((inputs) => {
            inputs = inputs.get();
            expect(inputs).to.have.length(3);
        });
        cy.get('.remove-button').last().click();
        cy.get('.input-employee').then((inputs) => {
            inputs = inputs.get();
            expect(inputs).to.have.length(2);
        });
        cy.get('.remove-button').last().click();
        cy.get('.remove-button').last().click();
        cy.get('.input-employee').should('not.exist');
    });

    it('allows to add and remove milestone fields', () => {
        cy.get('#milestone-container')
            .children('div')
            .then((milestones) => {
                milestones = milestones.get();
                expect(milestones).to.have.length(2);
            });
        cy.get('#add-milestone').click();
        cy.get('#add-milestone').click();
        cy.get('#add-milestone').click();
        cy.get('#milestone-container')
            .children('div')
            .then((milestones) => {
                milestones = milestones.get();
                expect(milestones).to.have.length(5);
            });
        cy.get('.d-block').last().click();
        cy.get('#milestone-container')
            .children('div')
            .then((milestones) => {
                milestones = milestones.get();
                expect(milestones).to.have.length(4);
            });
        cy.get('.d-block').last().click();
        cy.get('.d-block').last().click();
        cy.get('#milestone-container')
            .children('div')
            .then((milestones) => {
                milestones = milestones.get();
                expect(milestones).to.have.length(2);
            });
    });

    it('shows max length error messages on too long description', () => {
        cy.get('#input-description').as('descriptionField');

        cy.get('@descriptionField')
            .type(random(501))
            .then((field) => {
                field = field.get();
                expect(field[0].value).to.have.length(501);
            });

        cy.contains('Projekt erstellen').click();

        cy.get('@descriptionField')
            .closest('div')
            .contains('Maximal 500 Zeichen');
    });

    it.only('shows max length error messages on too long milestone description', () => {
        cy.get('.milestone-description').each((input) => {
            cy.wrap(input)
                .type(random(251))
                .then((field) => {
                    field = field.get();
                    expect(field[0].value).to.have.length(251);
                });
        });

        cy.contains('Projekt erstellen').click();

        cy.get('.milestone-description').each((input) => {
            cy.wrap(input).closest('div').contains('Maximal 250 Zeichen');
        });
    });
});

const random = (length) => {
    let chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
};
