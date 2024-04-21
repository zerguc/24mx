import { service } from "../services/service.js";
import { expect } from '@playwright/test';

export class MainPage {
    /**
     * @param {import('@playwright/test').Page} page - The Playwright page object
     */
    constructor(page) {
        this.page = page;
        this.cartIcon = this.page.locator('//div[@class="o-desktop-header__navigation__drawers__item o-desktop-header__navigation__drawers__item__minicart"]');
        this.searchInput = this.page.locator('#search-desktop');
        this.searchResultFirst = this.page.locator('div.m-searchlist--scrollable ul.ng-star-inserted li:first-of-type');
        this.productsAmount = this.page.locator('div.qa-pl-products-amount');

    }
    async navigateToMainPage() {
        await this.page.goto("https://www.24mx.pl/");
        await expect(this.cartIcon).toBeVisible({ timeout: 10000 });
        await this.page.click('button[id="CybotCookiebotDialogBodyLevelButtonAccept"]');
    }
    async executeSearchFirstResult(productType) {
        await this.searchInput.fill(productType);
        await expect(this.searchResultFirst).toBeVisible({ timeout: 5000 });
        await expect(this.searchResultFirst).toContainText(productType);
        await this.searchResultFirst.click();
        await service.validateSearchRequest(this.page, "https://24mx-pl.54proxy.com/search", productType);
    }
    async validateProductsAmount(quantityOfProducts) {
        await service.waitForDigitsInElement(this.productsAmount);
        let productAmountElementValue = (await this.productsAmount.innerText({ timeout: 10000 }));
        await expect(this.productsAmount).toBeVisible({ timeout: 10000 });
        expect(productAmountElementValue).toEqual(quantityOfProducts + " produkty");
    }

}
