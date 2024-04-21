import { test as base } from "@playwright/test";
import { service } from "../services/service.js";
import { apiCollection } from "../api/apiCollection.js";
import { MainPage } from "../pom/littlePom.js";
export * from "@playwright/test";
const a = service;
const b = apiCollection;

type MyFixtures = {
  service: typeof a;
  apiCollection: typeof b;
  mainPage:  MainPage;
};
export const test = base.extend<MyFixtures>({
  apiCollection: async ({ browser }, use) => {
    await use(b);
  },
  service: async ({ browser }, use) => {
    await use(a);
  },
  mainPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const mainPage = new MainPage(
      await context.newPage(),
    );
    await use(mainPage);
    await context.close();
  },
});
