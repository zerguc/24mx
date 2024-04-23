import { service } from "../../../services/service.js";
import { expect } from '@playwright/test';

const oponyKola_pageUrl = "https://www.24mx.pl/opony-i-kola";
export class OponyKolaPage {
    /**
     * @param {import('@playwright/test').Page} page - The Playwright page object
     */
    constructor(page) {
        this.page = page;
        this.cartIcon = this.page.locator('//div[@class="o-desktop-header__navigation__drawers__item o-desktop-header__navigation__drawers__item__minicart"]');
        this.productsAmount = this.page.locator('div.products-count');
    }
    async navigateToProductTypePage(productType) {
        let productTypeMainPath;
        switch (productType) {
            case "Opony Enduro":
                productTypeMainPath = "/opony-enduro_c10039";
                break;
            case "Opony Supermoto":
                productTypeMainPath = "/opony-supermoto_c10041";
                break;
        }
        let productTypeLink = oponyKola_pageUrl + productTypeMainPath
        await service.navigateToPageWithResponse(this.page, productTypeLink, "products?offset", productType, 200);
        let response = await service.navigateToPageWithResponse(this.page, productTypeLink, "products?offset", productType, 200);
        let responseBody = await response.text();
        const responseBodiesObject = JSON.parse(responseBody);
        let products_pid = [];
        responseBodiesObject.elements.forEach(element => {
            let elementData_array = element.attributes;
            let elementData_array_pid_object = elementData_array.filter(item => item.name === 'pid');
            let elementData_array_pid_id = elementData_array_pid_object[0].value;
            products_pid.push(elementData_array_pid_id);
        });
        console.log(productType + ": " + products_pid);
        await this.page.click('button[id="CybotCookiebotDialogBodyLevelButtonAccept"]');
        await expect(this.cartIcon).toBeVisible({ timeout: 10000 });
        return { products_pid }
    }
    async validateProductsAmount(quantityOfProducts) {
        await service.waitForDigitsInElement(this.productsAmount);
        let productAmountElementValue = (await this.productsAmount.innerText({ timeout: 10000 }));
        await expect(this.productsAmount).toBeVisible({ timeout: 10000 });
        expect(productAmountElementValue).toEqual(quantityOfProducts + " Produkt(y)");
    }
}
