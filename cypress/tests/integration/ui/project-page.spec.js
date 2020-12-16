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
                .then((numbers) => {
                    let projectNr = numbers.first().text();

                    cy.get('.card').contains(projectNr).click();

                    cy.url().should('contain', '/projects/1');
                    cy.contains(projectNr);
                });
        });

        it('navigates back to list', () => {
            cy.visit('/projects/1');

            cy.get('.breadcrumb').contains('Projekte'.toUpperCase()).click();

            cy.url().should('contain', '/projects');
        });

        it('shows 404 on wrong id', () => {
            cy.visit('/projects/wrong-id', {
                failOnStatusCode: false,
            });

            cy.contains('404');
        });

        it('navigates to add page', () => {
            cy.contains('Neues Projekt').click();
            cy.url().should('contain', '/projects/add');
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
                .then((numbers) => {
                    let projectNr = numbers.first().text();

                    cy.get('.card').contains(projectNr).click();

                    cy.wait('@findProject');

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
