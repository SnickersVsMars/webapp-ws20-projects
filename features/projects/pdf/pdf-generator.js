const puppeteer = require('puppeteer');

const navigationOptions = { waitUntil: 'networkidle2' };

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
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, navigationOptions);
    let pdf = await page.pdf(pdfOptions);
    await browser.close();

    return pdf;
};

module.exports = { generatePdf };
