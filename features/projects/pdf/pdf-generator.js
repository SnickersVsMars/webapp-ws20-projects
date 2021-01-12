const pdf = require('html-pdf');
const pug = require('pug');

const projectService = require('./../projectService');
const pdfOptions = { format: 'Letter' };

const compiledList = pug.compileFile('features/projects/pdf/list.pug');

const generateListPdf = (success) => {
    projectService.get((error, result) => {
        if (error) {
            return success(error, null);
        }
        let html = compiledList({ items: result });

        pdf.create(html, pdfOptions).toFile(
            './list.pdf',
            function (pdfError, path) {
                success(pdfError, path);
            }
        );
    });
};

module.exports = { generateListPdf };
