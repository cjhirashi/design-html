// RNF-002 · equivalente P5 (ADR-001): ningún recurso de hosts externos en runtime.
import { expect, test } from "@playwright/test";

for (const route of ["/", "/dashboard"]) {
  test(`${route} sólo pide recursos al propio origen`, async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const external: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (!url.startsWith("data:") && new URL(url).origin !== origin) external.push(url);
    });
    await page.goto(route, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState("networkidle");
    expect(external).toEqual([]);
  });
}
