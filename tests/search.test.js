import { test } from '../fixtures/test.js';

const oponyCategories = ['Opony Enduro', 'Opony Supermoto'];
let quantityOfProducts;
let listOfProductsForSale = [];

test.describe('API test: Check Products + UI: Check Product from DB match User access', () => {
    test.use({ viewport: { width: 2000, height: 1200 } });
    oponyCategories.forEach(productType => {
        test(`Search for ${productType}`, async ({ request, apiCollection, mainPage }) => {
            let productListUri = (await apiCollection.getProductsListURI_productType(request, productType)).productsListURI;
            quantityOfProducts = (await apiCollection.getListOfProductsInStock(request, productListUri)).quantityOfProducts;
            listOfProductsForSale = (await apiCollection.getListOfProductsInStock(request, productListUri)).listOfProductsForSale;
            await mainPage.navigateToMainPage();
            await mainPage.executeSearchFirstResult(productType);
            await mainPage.validateProductsAmount(quantityOfProducts);
        });
    });
});
