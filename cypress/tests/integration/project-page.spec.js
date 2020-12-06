/// <reference types="Cypress" />

describe('The project page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it.only('successfully redirects', () => {
        cy.url().should('contain', '/projects');
    });

    it.only('gets projects from server', () => {
        cy.get('.card').should((projects) => {
            projects = projects.get();

            expect(projects).to.have.length.greaterThan(1);
        });
    });

    it.only('can navigate to detail', () => {
        cy.get('.card')
            .get('.project-number')
            .then((number) => {
                let projectNr = number.first().text();

                cy.get('.card').contains(projectNr).click();

                // TODO projectNR or int primary key here instead
                cy.url().should(
                    'contain',
                    '/projects/5df14899-0c33-4164-a46e-f9d9fea3e377'
                );
            });
    });

    it.only('navigates back to list', () => {
        cy.visit('/projects/5df14899-0c33-4164-a46e-f9d9fea3e377');

        cy.get('.breadcrumb').contains('Projekte'.toUpperCase()).click();

        cy.url().should('contain', '/projects');
    });
});

describe('The project page with stubbed data', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.intercept('GET', '/api/projects', { fixture: 'projects.json' });
    });

    it.only('gets test projects and displays them', () => {
        cy.get('.card').should((projects) => {
            projects = projects.get();

            expect(projects).to.have.length(5);
        });
    });

    it.only('can navigate to detail', () => {
        cy.get('.card')
            .get('.project-number')
            .then((number) => {
                let projectNr = number.first().text();

                cy.get('.card').contains(projectNr).click();

                // TODO projectNR or int primary key here instead
                cy.url().should(
                    'contain',
                    '/projects/5df14899-0c33-4164-a46e-f9d9fea3e377'
                );
            });
    });

    it.only('navigates back to list', () => {
        cy.visit('/projects/5df14899-0c33-4164-a46e-f9d9fea3e377');

        cy.get('.breadcrumb').contains('Projekte'.toUpperCase()).click();

        cy.url().should('contain', '/projects');
    });
});
