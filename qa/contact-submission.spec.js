const { test, expect } = require('@playwright/test');

test('live Contact form submits successfully', async ({ page }) => {
  await page.goto('https://designingvirtuosity.com/contact.html', { waitUntil: 'networkidle' });

  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.dataset.cms || '')
  ).toBe('sanity');

  const firstProjectType = page.locator('#project-form input[name="project_type"]').first();
  await firstProjectType.check();

  await page.locator('#project-form [name="name"]').fill('Designing Virtuosity Production QA');
  await page.locator('#project-form [name="email"]').fill('hello@designingvirtuosity.com');
  await page.locator('#project-form [name="organization"]').fill('Designing Virtuosity Digital Media');
  await page.locator('#project-form [name="website"]').fill('https://designingvirtuosity.com');
  await page.locator('#project-form [name="brief"]').fill(
    'Automated production QA test submission. No response is required. This message confirms the live website contact transport.'
  );

  const budget = page.locator('#project-form [name="budget"]');
  if (await budget.locator('option').count() > 1) await budget.selectOption({ index: 1 });

  const timeline = page.locator('#project-form [name="timeline"]');
  if (await timeline.locator('option').count() > 1) await timeline.selectOption({ index: 1 });

  await page.locator('#project-form [name="source"]').fill('Production QA');

  await page.locator('#project-form button[type="submit"]').click();

  const status = page.locator('.form-status');
  await expect(status).toHaveClass(/success/, { timeout: 30000 });
  await expect(status).not.toHaveText('');
});
