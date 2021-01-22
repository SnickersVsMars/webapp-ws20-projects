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

        it('has a pdf download button', () => {
            cy.contains('Download').should(
                'have.attr',
                'href',
                '/projects/export'
            );
            cy.contains('Download').should('have.attr', 'target', '_blank');
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

            cy.get('#error').then(($el) => {
                cy.wrap($el).contains('Die Seite konnte nicht gefunden werden');
                cy.wrap($el).contains('404');
            });
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

        it('project search "snickers" finds matching project', () => {
            cy.get('#search-box').type('snickers');

            cy.get('.card:visible').then((cards) => {
                cards = cards.get();

                cards.forEach(() => {
                    cy.contains('snickers', { matchCase: false });
                });

                expect(cards).to.have.length(1);
            });
        });

        it('project search "projekt" finds matching projects', () => {
            cy.get('#search-box').type('projekt');

            cy.get('.card:visible').then((cards) => {
                cards = cards.get();

                cards.forEach(() => {
                    cy.contains('projekt', { matchCase: false });
                });

                expect(cards).to.have.length(5);
            });
        });

        it('project search for year finds matching projects', () => {
            cy.get('#search-box').type('2021');

            cy.get('.card:visible').then((cards) => {
                cards = cards.get();

                cards.forEach(() => {
                    cy.contains('2021');
                });

                expect(cards).to.have.length(4);
            });
        });

        it('project search non existant text finds no project', () => {
            cy.get('#search-box').type('not existing content');

            cy.get('.card:visible').should('not.exist');
        });
    });
});
