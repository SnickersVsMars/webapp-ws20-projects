const puppeteer = require('puppeteer');

const pdfOptions = {
    format: 'A4',
    displayHeaderFooter: true,
    margin: {
        top: 60,
        left: 0,
        bottom: 70,
        right: 0,
    },
};

const generatePdf = async (url) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('#load-finished');
    let pdfBuffer = await page.pdf(pdfOptions);
    await browser.close();

    return pdfBuffer;
};

module.exports = { generatePdf };
