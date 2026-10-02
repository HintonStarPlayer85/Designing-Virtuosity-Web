const { test, expect } = require('@playwright/test');

test('services visual regression', async ({ page }) => {
  await page.goto('https://designingvirtuosity.com/services.html', { waitUntil: 'networkidle' });

  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.dataset.cms || '')
  ).toBe('sanity');

  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toContain('\\n');

  const result = await page.evaluate(() => {
    const serviceSection = document.querySelector('.services-systems');
    const processSection = document.querySelector('.services-process');
    const firstPanel = document.querySelector('.service-panel:nth-child(1)');
    const secondPanel = document.querySelector('.service-panel:nth-child(2)');
    const faq = document.querySelector('.dv-faq');
    const cta = document.querySelector('.cta-band');

    const faqBox = faq.getBoundingClientRect();
    const ctaBox = cta.getBoundingClientRect();

    return {
      serviceBackground: getComputedStyle(serviceSection).backgroundImage,
      processBackground: getComputedStyle(processSection).backgroundImage,
      firstAccent: getComputedStyle(firstPanel).getPropertyValue('--svc-a').trim(),
      secondAccent: getComputedStyle(secondPanel).getPropertyValue('--svc-a').trim(),
      gap: Math.abs(ctaBox.top - faqBox.bottom)
    };
  });

  expect(result.serviceBackground).toContain('radial-gradient');
  expect(result.processBackground).toContain('radial-gradient');
  expect(result.firstAccent).not.toBe(result.secondAccent);
  expect(result.gap).toBeLessThanOrEqual(2);
});
