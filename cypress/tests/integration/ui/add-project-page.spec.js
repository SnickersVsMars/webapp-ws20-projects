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

        cy.get('.invalid-feedback').then((errors) => {
            errors = errors.get();
            expect(errors).to.have.length(5);
        });

        cy.contains('Format verwenden: PR20-0001');
        cy.contains('Namen der zuständigen Person angeben');
        cy.contains('Namen des Kunden angeben');
        cy.contains('Bezeichnung für das Projekt angeben');
        cy.contains('Kostenstelle angeben');
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
});
