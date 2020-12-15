/// <reference types="Cypress" />

describe('The project page', () => {
    context('With data from server', () => {
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

            cy.contains('Format verwenden z.B.: PR20-0001');
            cy.contains('Namen der zuständigen Person angeben');
            cy.contains('Namen des Kunden angeben');
            cy.contains('Bezeichnung für das Projekt angeben');
            cy.contains('Kostenstelle angeben');
        });
    });
});
