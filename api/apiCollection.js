const baseUrl = "https://www.24mx.pl/INTERSHOP/rest/WFS/";
export const apiCollection = {
    getProductsListURI_productType: async (request, productType) => {
        const categorySortingPath = "Pierce-24mx-Site/24mx-pl/products?searchTerm=%26%40QueryTerm%3D*%26OnlineFlag%3DPL%26%40Sort.categorySortingAttribute_PL%3D0%26OnlineFlag%3DPL%26%40Sort.categorySortingAttribute_PL%3D0";
        let productsListURI;
        let responseFilters = await request.get(baseUrl + categorySortingPath);
        let respFilters = await responseFilters.json();
        let categoryFilters = respFilters.filters.find(filter => filter.name === "CategoryUUIDLevel2").filterEntries;
        categoryFilters.forEach(element => {
            if (element.displayId === productType) {
                productsListURI = element.uri;
            }
        });
        return { productsListURI }
    },
    getListOfProductsInStock: async (request, productsListURI) => {
        let listOfProductsForSale = [];
        let quantityOfProducts;
        let responseProductsListURI = await request.get(baseUrl + productsListURI);
        let respProducts = await responseProductsListURI.json();
        let items = respProducts.elements;
        items.forEach(element => {
            let elementPID = element.attributes.find(attr => attr.name === "pid").value;
            let elementInStockStatus = element.attributes.find(attr => attr.name === "inStock").value;
            elementInStockStatus ? listOfProductsForSale.push(elementPID) : console.log(elementPID + " : Product Not For Sale")
        });
        listOfProductsForSale.length > 1 ? console.log("Test will be executed for the next list of Products: " + listOfProductsForSale) : console.log(elementPID + " : No Products For Sale in this Category")
        quantityOfProducts = listOfProductsForSale.length.toString();
        return { listOfProductsForSale, quantityOfProducts }
    }
}