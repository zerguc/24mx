import { expect } from '@playwright/test';
class Service {
    async navigateToPageWithResponse(
        page,
        navigationLink,
        responseUrlInclude,
        applicationName,
        responseStatus
    ) {
        console.log(
            navigationLink,
            " :",
            " on Network of application: ",
            applicationName,
            " waiting for ",
            responseUrlInclude
        );
        const responseForWait = page.waitForResponse(
            (resp) =>
                resp.url().includes(responseUrlInclude) && resp.status() === responseStatus,
            { timeout: 45000 }
        );
        await page.goto(navigationLink);
        let response = await responseForWait;
        return response;
    }
    async waitForDigitsInElement(locator) {
        const startTime = Date.now();
        const timeout = 5000;
        while (true) {
            const element = locator;
            const textContent = await element.innerText();
            if (this.containsDigits(textContent)) {
                return textContent;
            }
            if (Date.now() - startTime >= timeout) {
                throw new Error("Timeout exceeded while waiting for element to contain digits");
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    containsDigits(str) {
        return /\d/.test(str);
    }
    async validateSearchRequest(page, requestUrlIncludes, productType) {
        let searchRequest_response = await this.waitForResponseOnPage(page, "search_request", requestUrlIncludes, productType, productType, 200);
        let searchRequest_requestBody = JSON.parse(searchRequest_response.request().postData());
        // Validate query string
        let searchQueryString = searchRequest_requestBody.QueryString;
        expect(searchQueryString).toEqual(productType.toLowerCase());
    }
}
export const service = new Service();
