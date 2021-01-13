const puppeteer = require('puppeteer');

const projectService = require('./../projectService');

const generateListPdf = (success) => {
    projectService.get((error, result) => {
        if (error) {
            return success(error);
        }

        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto('http://localhost:3000/projects', {
                waitUntil: 'networkidle2',
            });

            // TODO @mlamprecht return as stream
            await page.pdf({
                path: 'tmp/list.pdf',
                format: 'A4',
                displayHeaderFooter: true,
                margin: {
                    top: 60,
                    left: 0,
                    bottom: 70,
                    right: 0,
                },
            });

            await browser.close();
        })();

        success();
    });
};

module.exports = { generateListPdf };
