const projectsPath = '/api/projects';

describe('Projects API', () => {
    context('GET /projects/export', () => {
        it('gets a pdf from the server', () => {
            cy.request('GET', '/projects/export').then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body).length.to.be.greaterThan(0);

                expect(res).to.have.property('headers');
                expect(res.headers['content-type']).to.equal('application/pdf');
            });
        });
    });

    context('GET /projects/:id/export', () => {
        it('gets a pdf from the server', () => {
            cy.request('GET', 'projects/1/export').then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body).length.to.be.greaterThan(0);

                expect(res).to.have.property('headers');
                expect(res.headers['content-type']).to.equal('application/pdf');
            });
        });
    });
});
