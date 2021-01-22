describe('The project detail page', () => {
    beforeEach(() => {
        cy.visit('/projects/1');
    });

    it('navigates to edit page when clicked', () => {
        cy.contains('Projekt bearbeiten')
            .click()
            .then(() => {
                cy.url().should('contain', '/projects/1/edit');
            });
    });

    // TODO test upload, maybe download
});
