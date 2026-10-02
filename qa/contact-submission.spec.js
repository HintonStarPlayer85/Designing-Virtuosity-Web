const { test, expect } = require('@playwright/test');

test('diagnose live Contact form transport', async ({ page }) => {
  await page.goto('https://designingvirtuosity.com/contact.html', { waitUntil: 'networkidle' });

  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.dataset.cms || '')
  ).toBe('sanity');

  await page.locator('#project-form input[name="project_type"]').first().check();
  await page.locator('#project-form [name="name"]').fill('Designing Virtuosity Production QA');
  await page.locator('#project-form [name="email"]').fill('hello@designingvirtuosity.com');
  await page.locator('#project-form [name="organization"]').fill('Designing Virtuosity Digital Media');
  await page.locator('#project-form [name="website"]').fill('https://designingvirtuosity.com');
  await page.locator('#project-form [name="brief"]').fill(
    'Automated production QA diagnostic submission. No response is required.'
  );
  await page.locator('#project-form [name="source"]').fill('Production QA');

  const responsePromise = page.waitForResponse(
    response => response.url().includes('formsubmit.co/ajax/'),
    { timeout: 30000 }
  );

  await page.locator('#project-form button[type="submit"]').click();
  const response = await responsePromise;

  const responseText = await response.text().catch(() => '');
  console.log('FORMSUBMIT_STATUS=' + response.status());
  console.log('FORMSUBMIT_HEADERS=' + JSON.stringify(await response.allHeaders()));
  console.log('FORMSUBMIT_BODY=' + responseText);

  const status = page.locator('.form-status');
  await expect(status).not.toHaveText('');
  console.log('FORM_UI_CLASS=' + await status.getAttribute('class'));
  console.log('FORM_UI_TEXT=' + await status.textContent());

  expect(response.status()).toBeGreaterThanOrEqual(200);
  expect(response.status()).toBeLessThan(500);
});
