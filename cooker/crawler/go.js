const PROJECT = {
  name: process.env['P_NAME'],
  urlTemp: process.env['P_URL'],
  pageEnd: parseInt(process.env['P_PAGE']),
  pageStart: parseInt(process.env['P_PAGE_START']) || 0,
}


const puppeteer = require('puppeteer');
const tools = require('./tools.js');

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await tools.getAllPages(page, PROJECT)
  await browser.close();
})();
