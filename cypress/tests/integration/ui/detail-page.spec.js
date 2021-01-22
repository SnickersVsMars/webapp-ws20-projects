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

    it('has a pdf download button', () => {
        cy.contains('Download').should(
            'have.attr',
            'href',
            'http://localhost:3000/projects/1/export'
        );
        cy.contains('Download').should('have.attr', 'target', '_blank');
    });

    // TODO test files
});
