import { test, expect } from "@playwright/test";

test("day/night rotates the celestial orbit and preserves the selected theme", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Aktifkan dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect.poll(() => page.locator(".celestial-orbit").evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).a + 1)), { timeout: 15000 }).toBeLessThan(0.0001);
  const moon = await page.locator(".celestial-moon").boundingBox();
  const header = await page.locator(".site-header").boundingBox();
  expect(moon.y).toBeGreaterThan(header.y + header.height + 20);
  expect(moon.x).toBeGreaterThan(20);
  expect(moon.x + moon.width).toBeLessThan(1420);
  expect(moon.y + moon.height).toBeLessThan(400);
  await page.screenshot({ path: "test-results/landing-dark.png", fullPage: true });
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Aktifkan light mode" }).click();
  await expect.poll(() => page.locator(".celestial-orbit").evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).a - 1)), { timeout: 15000 }).toBeLessThan(0.0001);
  await page.screenshot({ path: "test-results/landing-light.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("tasks, schedule, assistant and demo navigation remain usable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Jelajahi Demo" }).click();
  await expect(page.getByRole("heading", { name: "Your focus, at a glance." })).toBeVisible();
  await page.getByRole("button", { name: "+ Tambah Tugas" }).click();
  await page.getByLabel("Nama Tugas").fill("Uji antarmuka futuristis");
  await page.getByLabel("Mata Kuliah").fill("Desain Interaksi");
  await page.getByLabel("Deadline", { exact: true }).fill("2099-11-13T17:00");
  await page.getByLabel("Estimasi Waktu Pengerjaan").fill("2");
  await page.getByRole("button", { name: "Simpan Tugas" }).click();
  const row = page.getByRole("row").filter({ hasText: "Uji antarmuka futuristis" });
  await expect(row).toBeVisible();
  await row.getByRole("combobox").selectOption("Selesai");
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("priorify_tasks")).find(t => t.title === "Uji antarmuka futuristis").status)).toBe("Selesai");
  await page.screenshot({ path: "test-results/dashboard-light.png", fullPage: true });
  await page.getByRole("button", { name: "Jadwal", exact: true }).click();
  await page.getByLabel("Hari", { exact: true }).selectOption("Minggu");
  await page.getByLabel("Jam Mulai").fill("06:00");
  await page.getByLabel("Jam Selesai").fill("07:00");
  await page.getByLabel("Keterangan").fill("Sesi fokus pengujian");
  await page.getByRole("button", { name: "Tambah Jadwal Kosong" }).click();
  await expect(page.locator(".slot-item").filter({ hasText: "Sesi fokus pengujian" })).toBeVisible();
  await page.getByRole("button", { name: "Assistant", exact: true }).click();
  await page.getByRole("button", { name: "Tanya prioritas" }).click();
  await page.getByRole("button", { name: "Kirim", exact: true }).click();
  await expect(page.locator(".message")).toHaveCount(3);
  await expect(page.getByLabel("Pesan untuk Priorify AI")).toHaveValue("");
});

test("settings persist and reduced motion disables decorative animation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Jelajahi Demo" }).click();
  await page.getByRole("button", { name: "Pengaturan", exact: true }).click();
  await page.getByRole("button", { name: /Midnight/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("checkbox", { name: "Aktifkan animasi" }).uncheck();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.locator(".focus-core").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => { document.documentElement.dataset.motion = "full"; });
  expect(await page.locator(".focus-core").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
});

for (const width of [360, 768, 1440]) {
  test(`all pages fit a ${width}px screen in both themes`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    for (const theme of ["light", "dark"]) {
      if (theme === "dark") await page.getByRole("button", { name: "Aktifkan dark mode" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      if (theme === "dark") {
        await expect(page.locator(".celestial-moon")).toHaveCSS("opacity", "1");
        const moon = await page.locator(".celestial-moon").boundingBox();
        const header = await page.locator(".site-header").boundingBox();
        expect(moon.y).toBeGreaterThan(header.y + header.height + 20);
        expect(moon.x).toBeGreaterThan(10);
        expect(moon.x + moon.width).toBeLessThan(width - 10);
      }
      await page.getByRole("button", { name: "Priorify AI — beranda" }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (width === 360) await page.screenshot({ path: `test-results/mobile-${theme}.png`, fullPage: true });
      if (theme === "light") await page.getByRole("button", { name: "Jelajahi Demo" }).click();
      for (const name of ["Dashboard", "Tugas", "Jadwal", "Assistant", "Pengaturan"]) {
        await page.getByRole("button", { name, exact: true }).click();
        await expect(page.locator("main h2")).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    }
    await page.getByRole("button", { name: "Logout", exact: true }).click();
    await page.getByRole("button", { name: "Masuk", exact: true }).click();
    await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
