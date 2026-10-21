import { test, expect } from "./harness";

// STEPS identity: metadata, relative brand assets, accessible header/footer marks and the official X link.
test("STEPS identity is integrated with relative assets and accessible names", async ({ page, request }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("STEPS · Build on every step");
  await expect(page.getByRole("heading", { level: 1, name: "Build on every step." })).toBeVisible();
  const brand = page.getByRole("link", { name: "STEPS home", exact: true });
  await expect(brand).toBeVisible();
  const box = (await brand.locator("svg").boundingBox())!;
  const width = page.viewportSize()!.width;
  expect(box.height).toBeGreaterThanOrEqual(24);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
  const meta = async (sel: string) => page.locator(sel).getAttribute("content");
  expect(await meta('meta[name="description"]')).toContain("Stepstoke");
  expect(await meta('meta[property="og:title"]')).toBe("STEPS · Build on every step");
  expect(await meta('meta[property="og:image"]')).toBe("./og.png");
  expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
  expect(await meta('meta[name="twitter:site"]')).toBe("@stepstoke");
  const icons = await page.locator('link[rel="icon"],link[rel="apple-touch-icon"]').evaluateAll(ls => ls.map(l => l.getAttribute("href")));
  expect(icons).toEqual(["./favicon.svg", "./favicon-32.png", "./favicon-16.png", "./apple-touch-icon.png"]);
  for (const href of [...icons, "./og.png", "./og.svg"]) {
    const res = await request.get(new URL(href!, page.url()).href);
    expect(res.status(), href!).toBe(200);
    if (href!.endsWith(".svg")) expect(await res.text()).not.toMatch(/<script|foreignObject|href=|url\(|@import|<text/i);
  }
  const x = page.getByRole("link", { name: "@stepstoke on X (opens in a new tab)" });
  await expect(x).toHaveAttribute("href", "https://x.com/stepstoke");
  await expect(x).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator("footer")).toContainText("STEPS by Stepstoke");
  await brand.focus();
  await expect(brand).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

// Long history at desktop widths: labels sit on their own row, titles keep their width, scroll and selection work.
test("long history keeps round titles readable beside Latest and Selected", async ({ page }) => {
  test.skip(page.viewportSize()!.width <= 1000, "Desktop rail layout only");
  await page.goto("./#/demo/b/fx-branch-1");
  await expect(page.getByRole("heading", { name: "Relay introduction", exact: true })).toBeVisible();
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("platform.fixture.v1")!);
    const last = state.checkpoints.find((c: { id: string }) => c.id === "fx-branch-1:3");
    for (let r = 4; r <= 12; r++) state.checkpoints.push({ ...structuredClone(last), id: `fx-branch-1:${r}`, revision: r });
    state.branches.find((b: { id: string }) => b.id === "fx-branch-1").latestCheckpoint = "fx-branch-1:12";
    localStorage.setItem("platform.fixture.v1", JSON.stringify(state));
  });
  await page.reload();
  const items = page.locator(".sequence-rail .round-item");
  await expect(items).toHaveCount(13);
  await expect(page.getByRole("button", { name: "Later →" })).toBeVisible();
  const check = async () => {
    for (const item of await items.all()) {
      const info = (await item.locator(".round-info").boundingBox())!;
      const labels = (await item.locator(".round-labels").boundingBox())!;
      const title = (await item.locator(".round-info strong").boundingBox())!;
      expect(info.width).toBeGreaterThanOrEqual(72);
      expect(title.height).toBeLessThan(30); // "Round N" stays on one line
      expect(labels.y).toBeGreaterThanOrEqual(info.y + info.height - 1);
    }
  };
  await check();
  const earlier = page.getByRole("button", { name: /^Select Round 4/ });
  await earlier.scrollIntoViewIfNeeded();
  await earlier.click();
  await expect(earlier).toHaveAttribute("aria-current", "step");
  await expect(page.locator(".round-item.selected .tag-accent")).toHaveText("Selected");
  await check();
  await page.locator(".sequence").screenshot({ path: `../test/scratch/long-history-${test.info().project.name}.png` });
  await page.getByRole("button", { name: "Later →" }).click();
  await expect.poll(() => page.locator(".sequence-rail").evaluate(e => e.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});
