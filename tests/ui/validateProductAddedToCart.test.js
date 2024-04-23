import { expect, test } from '../../fixtures/test.js';
/* 
This test is written within a straightforward script and takes test data on the fly.
For the convenience of supporting an automation framework, sometimes this option is better than POM.
Provided that test scenarios have been created and the structure of the application is more of the same type.
Also with this approach we can adjust script considering real user behavior.

Navigate to Product page.
Retreive Product data from UI.
Add Product to Cart.
Navigate to Cart.
Validate recorded Product data is represented on Cart Page.

*/
test('UI: Product Order', async ({ page }) => {
    let productData = {};
    let cartData = {};
    let deliveryTerm = "24godz";
    await page.goto("https://www.24mx.pl/product/buty-cross-raven-trooper-czarne_pid-PM-4902844?nosto=is-startpage-topsellers");
    await page.click('#CybotCookiebotDialogBodyLevelButtonAccept');
    productData.name = await page.locator('.qa-pdp-product-name').innerText();
    productData.price = (await page.locator('.qa-product-price').innerText()).substring(3);
    await page.click('.o-productpage__add-to-cart .qa-pdp-product-variants');
    await page.click('//div[@class="m-select__items-wrapper"]//li[1]');
    await page.click('//div[contains(text(),"Wysyłka i zwroty")]');
    await expect(page.locator('//p[contains(text(),"' + deliveryTerm + '")]')).toBeAttached();
    await page.click('.qa-pdp-add-to-cart-btn');
    await expect(page.locator('.qa-product-added-to-cart-overlay')).toBeVisible({ timeout: 10000 });
    await page.click('.qa-proceed-to-checkout');
    cartData.name = await page.locator('.qa-pli-item-name').innerText();
    cartData.price = await page.locator('.qa-total-price').innerText();
    cartData.cartDeliveryTerm = await page.locator('.m-checkout-list__item-delivery-info--checkout').innerText();
    expect(cartData.name).toContain(productData.name);
    expect(cartData.price).toContain(productData.price);
    expect(cartData.cartDeliveryTerm).toContain(deliveryTerm);
});