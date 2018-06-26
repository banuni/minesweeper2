import * as puppeteer from 'puppeteer';

before(async () => {
    global.browser = await puppeteer.launch({headless: false, devtools: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
});

after(async () => {
    await global.browser.close();
});
