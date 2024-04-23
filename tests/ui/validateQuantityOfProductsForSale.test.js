import { expect, test } from '../../fixtures/test.js';
/* 
Retreive product type quantity of products for sale.
Navigate to the website's specific product type page.
Validate the Product Type specific page reflects correct quantity of Products for sale. 
Validate the Product Type specific page receives correct list of Products for sale. 
**/

const oponyCategories = ['Opony Enduro', 'Opony Supermoto'];
let quantityOfProducts;
let listOfProductsForSale = [];

test.describe('API test: Check Products + UI test: Check Product from DB match User access', () => {
    test.use({ viewport: { width: 2000, height: 1200 } });
    oponyCategories.forEach(productType => {
        test(`Search for ${productType}`, async ({ request, apiCollection, oponyKolaPage }) => {
            let productListUri = (await apiCollection.getProductsListURI_productType(request, productType)).productsListURI;
            quantityOfProducts = (await apiCollection.getListOfProductsInStock(request, productListUri)).quantityOfProducts;
            listOfProductsForSale = (await apiCollection.getListOfProductsInStock(request, productListUri)).listOfProductsForSale;
            let products_pids = (await oponyKolaPage.navigateToProductTypePage(productType)).products_pid;
            // Validate Products Amount Counter shows correct value
            await oponyKolaPage.validateProductsAmount(quantityOfProducts);
            let nestingBoolean = listOfProductsForSale.every(value => products_pids.includes(value));
            // Validate UI received the same list of products as it is on BE
            expect(nestingBoolean).toBe(true);
        });
    });
});
