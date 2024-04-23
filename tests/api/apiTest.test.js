import { test, expect } from '../../fixtures/test.js';
/* 
As most API calls are not permitted without authentication
just playing with status codes and responses.
**/
let baseUrl = "https://www.24mx.ie/INTERSHOP/rest/WFS/Pierce-24mx-Site/24mx-ie";
test.describe.configure({ mode: 'serial' });
test.describe('API Chain', () => {
    // Here we gather all actual data and behavior of endpoints
    // In the second test we just do test of obtained data
    let links = [];
    let updatedLinks = [];

    test('API: Gather data', async ({ request }) => {
        let response = await request.get(baseUrl);
        let responseBody = await response.json();

        async function getEndPoint() {
            let resourceCollectionElements = responseBody.elements;
            resourceCollectionElements.forEach(element => {
                let elementUri = element.uri;
                let elementLink = "https://www.24mx.ie/INTERSHOP/rest/WFS/" + elementUri;
                let elementData = { url: elementLink };
                links.push(elementData);
            });
            return links;
        }
        async function callLinks() {
            let links = await getEndPoint();
            for (let link of links) {
                let response = await request.get(link.url);
                let statusCode = response.status();
                let elementData = { ...link, status: statusCode };
                updatedLinks.push(elementData);
            }
            console.log(updatedLinks);
            return updatedLinks;
        }
        await callLinks();
    });
    // Check obtained data
    test('API Status checks', async ({ request }) => {
        for (let link of updatedLinks) {
            let response = await request.get(link.url);
            let statusCode = response.status();
            expect(statusCode).toBe(link.status);
        }
    });
});

let categories = "https://www.24mx.ie/INTERSHOP/rest/WFS/Pierce-24mx-Site/24mx-ie/categories";
test('API: Check method not allowed', async ({ request }) => {
    const data = {
        type: "Category",
        hasOnlineSubCategories: true,
        online: "1",
        id: "my_category_id",
        uri: "Pierce-24mx-Site/24mx-ie/categories/my_category_uri"
    };
    const response = await request.post(categories, data);
    let responseStatus = response.status();
    let responseStatusText = response.statusText();
    expect(responseStatus).toBe(405);
    expect(responseStatusText).toBe("Method Not Allowed");
});