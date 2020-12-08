/// <reference types="Cypress" />

describe('The project page', () => {
    context('With data from server', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('successfully redirects', () => {
            cy.url().should('contain', '/projects');
        });

        it('displays list of projects', () => {
            cy.get('.card').should((projects) => {
                projects = projects.get();

                expect(projects).to.have.length.greaterThan(1);
            });
        });

        it('can navigate to detail', () => {
            cy.get('.card')
                .get('.project-number')
                .then((number) => {
                    let projectNr = number.first().text();

                    cy.get('.card').contains(projectNr).click();

                    // TODO projectNR here instead
                    cy.url().should('contain', '/projects/1');
                    cy.contains(projectNr);
                });
        });

        it('navigates back to list', () => {
            cy.visit('/projects/1');

            cy.get('.breadcrumb').contains('Projekte'.toUpperCase()).click();

            cy.url().should('contain', '/projects');
        });
    });

    context('With stubbed data', () => {
        beforeEach(() => {
            cy.intercept('GET', /\/api\/projects\/.*/, {
                fixture: 'project.json',
            }).as('findProject');
            cy.intercept('GET', /\/api\/projects\?/, {
                fixture: 'projects.json',
            }).as('getProjects');

            cy.visit('/');
            cy.wait('@getProjects');
        });

        it('gets test projects and displays them', () => {
            cy.get('.card').should((projects) => {
                projects = projects.get();

                expect(projects).to.have.length(5);
            });
        });

        it('can navigate to detail', () => {
            cy.get('.card')
                .get('.project-number')
                .then((number) => {
                    let projectNr = number.first().text();

                    cy.get('.card').contains(projectNr).click();

                    cy.wait('@findProject');

                    // TODO projectNR or int primary key here instead
                    cy.url().should('contain', '/projects/1');

                    cy.contains(projectNr);
                });
        });

        it('navigates back to list', () => {
            cy.visit('/projects/1');
            cy.wait('@findProject');

            cy.get('.breadcrumb').contains('Projekte'.toUpperCase()).click();

            cy.url().should('contain', '/projects');
        });
    });
});