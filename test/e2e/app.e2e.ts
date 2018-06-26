import {expect} from 'chai';
import {beforeAndAfter, app} from './../environment';
import './e2e-common';

describe('React application', () => {
    beforeAndAfter([[{isMine: true}, {isMine: false}], [{isMine: false}, {isMine: false}]]);

    describe('open page', () => {
        it('have game area', async () => {
            const page = await browser.newPage();
            await page.goto(app.getUrl('/'));
            expect(await page.waitForSelector('div.game-area', {timeout: 1000}));
        });
        it('Click a mine and lose the game', async () => {
            const page = await browser.newPage();
            await page.goto(app.getUrl('/'));
            let count = await page.evaluate(() => {
                return document.querySelectorAll('[data-hook="cell"]').length;
            });
            expect(await count).is.equals(36);
            await page.click('[data-isMine]');
            expect(await page.$eval('[data-status]', e => e.innerText)).to.equal('You lose');
        });
        it('Reveal non-mine cells and win the game', async () => {
            const page = await browser.newPage();
            await page.goto(app.getUrl('/'));
            const cells = await page.$$('[data-hook="cell"]');
            cells.slice(1).map((cell: any) => cell.click());
            expect(await page.$eval('[data-status]', e => e.innerText)).to.equal('You win');
        });
        it('not respond to clicks after a loss', async () => {
            const page = await browser.newPage();
            await page.goto(app.getUrl('/'));
            const cells = await page.$$('[data-hook="cell"]');
            await page.click('[data-isMine]');
            cells.slice(1).map((cell: any) => cell.click());
            expect(await page.$eval('[data-status]', e => e.innerText)).to.equal('You lose');
        });
    });
});
