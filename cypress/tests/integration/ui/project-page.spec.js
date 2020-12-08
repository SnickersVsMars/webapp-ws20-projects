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

        it('project search "snickers" finds matching project', () => {
            cy.get('#search-box').type('snickers');

            cy.get('.card').then((cards) => {
                cards = cards.get();

                cards.forEach(() => {
                    // since we use stubbed data we know that the S here is capitalized
                    cy.contains('Snickers');
                });

                expect(cards).to.have.length(1);
            });
        });

        it('project search "projekt" finds matching projects', () => {
            cy.get('#search-box').type('projekt');

            cy.get('.card').then((cards) => {
                cards = cards.get();

                cards.forEach(() => {
                    // since we use stubbed data we know that the p's are capitalized
                    cy.contains('Projekt');
                });

                expect(cards).to.have.length(5);
            });
        });

        it('project search for year finds matching projects', () => {
            cy.get('#search-box').type('2021');

            cy.get('.card').then((cards) => {
                cards = cards.get();

                cards.forEach(() => {
                    // since we use stubbed data we know that the p's are capitalized
                    cy.contains('2021');
                });

                expect(cards).to.have.length(4);
            });
        });

        it('project search non existant text finds no project', () => {
            cy.get('#search-box').type('not existing content');

            cy.get('.card').should('not.exist');
        });
    });
});
