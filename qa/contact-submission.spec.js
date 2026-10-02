const { test, expect } = require('@playwright/test');

test('diagnose live Contact browser transport failure', async ({ page }) => {
  const failedRequests = [];
  const consoleMessages = [];
  const pageErrors = [];

  page.on('requestfailed', request => {
    failedRequests.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure(),
    });
  });

  page.on('console', message => {
    consoleMessages.push({
      type: message.type(),
      text: message.text(),
    });
  });

  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('https://designingvirtuosity.com/contact.html', { waitUntil: 'networkidle' });

  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.dataset.cms || '')
  ).toBe('sanity');

  await page.locator('#project-form input[name="project_type"]').first().check();
  await page.locator('#project-form [name="name"]').fill('Designing Virtuosity Production QA');
  await page.locator('#project-form [name="email"]').fill('hello@designingvirtuosity.com');
  await page.locator('#project-form [name="organization"]').fill('Designing Virtuosity Digital Media');
  await page.locator('#project-form [name="brief"]').fill(
    'Automated production QA browser-transport diagnostic. No response is required.'
  );
  await page.locator('#project-form [name="source"]').fill('Production QA');

  await page.locator('#project-form button[type="submit"]').click();
  await page.waitForTimeout(5000);

  const status = page.locator('.form-status');
  console.log('FORM_UI_CLASS=' + await status.getAttribute('class'));
  console.log('FORM_UI_TEXT=' + await status.textContent());
  console.log('FAILED_REQUESTS=' + JSON.stringify(failedRequests));
  console.log('CONSOLE_MESSAGES=' + JSON.stringify(consoleMessages));
  console.log('PAGE_ERRORS=' + JSON.stringify(pageErrors));

  await expect(status).not.toHaveText('');
});
