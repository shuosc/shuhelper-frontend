import 'mocha';
import {launch, Page} from 'puppeteer';
import {expect} from 'chai';

async function click(page: Page, selector: string) {
    await page.evaluate(
        (selectorValue) =>
            (document.querySelector(selectorValue) as HTMLElement).click(),
        selector);
}

async function getTextContent(page: Page, selector: string): Promise<string> {
    return await page.evaluate(
        (selectorValue) => {
            return (document.querySelector(selectorValue) as HTMLElement).innerText;
        }, selector);
}

async function login(page: Page) {
    await click(page, '.v-navigation-drawer__content button');
    await page.waitFor(5000);
    await click(page, 'form input[name=login]');
    await page.keyboard.sendCharacter(process.env.E2E_USERNAME!);
    await click(page, 'form input[name=password]');
    await page.keyboard.sendCharacter(process.env.E2E_PASSWORD!);
    await click(page, '.v-card__actions > button');
    await page.waitFor(5000);
}

describe('e2e test', function() {
    this.timeout(60000);
    it('能访问', async () => {
        const browser = await launch({args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.setViewport({width: 1024, height: 768});
        await page.goto(process.env.TARGET_SITE!);
        const title = await page.evaluate(() =>
            document.getElementsByClassName('v-toolbar__title')[0].textContent);
        expect(title).eq('SHUHelper');
    });
    it('能登录', async () => {
        if (new Date().getHours() < 7 || new Date().getHours() > 22) {
            console.warn('此时信息办登录接口已经关闭，无法进行登录的测试！');
            return;
        }
        const browser = await launch({args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.goto(process.env.TARGET_SITE!);
        await login(page);
        expect(await getTextContent(page, '.username')).eq(process.env.E2E_NAME!);
    });
});
