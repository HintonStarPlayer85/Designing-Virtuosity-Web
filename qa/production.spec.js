const { test, expect } = require('@playwright/test');

const origin = 'https://designingvirtuosity.com';

const routes = [
  {name: 'Home', path: '/'},
  {name: 'Services', path: '/services.html'},
  {name: 'Portfolio', path: '/portfolio.html'},
  {name: 'Contact', path: '/contact.html'},
];

for (const route of routes) {
  test(route.name + ' hydrates from Sanity', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(origin + route.path, { waitUntil: 'networkidle' });

    await expect.poll(async () =>
      page.evaluate(() => document.documentElement.dataset.cms || '')
    ).toBe('sanity');

    expect(pageErrors).toEqual([]);
    await expect(page.locator('body')).toContainText('Designing Virtuosity');
  });
}

test('Services renders CMS service content', async ({ page }) => {
  await page.goto(origin + '/services.html', { waitUntil: 'networkidle' });

  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.dataset.cms || '')
  ).toBe('sanity');

  const panels = page.locator('.service-stack .service-panel');
  await expect(panels).toHaveCount(6);

  const titles = await panels.locator('.service-button h2').allTextContents();
  expect(titles.every(title => title.trim().length > 0)).toBeTruthy();

  const gradientWord = page.locator('.page-hero .gradient-word');
  await expect(gradientWord).toHaveText('Six design systems.');
  const gradientStyle = await gradientWord.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      color: style.color,
      backgroundImage: style.backgroundImage,
      backgroundClip: style.backgroundClip || style.webkitBackgroundClip,
    };
  });
  expect(gradientStyle.color).toBe('rgba(0, 0, 0, 0)');
  expect(gradientStyle.backgroundImage).toContain('linear-gradient');

  const clientChips = page.locator('.client-wall .client-chip');
  expect(await clientChips.count()).toBeGreaterThan(0);
});

test('Portfolio opens structured Hinton Consulting case study', async ({ page }) => {
  await page.goto(origin + '/portfolio.html', { waitUntil: 'networkidle' });

  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.dataset.cms || '')
  ).toBe('sanity');

  const hinton = page.locator('.feature-project[data-case-title="Hinton Consulting"]').first();
  await expect(hinton).toBeVisible();
  await hinton.click();

  const modal = page.locator('.case-modal');
  await expect(modal).toHaveClass(/open/);
  await expect(modal.locator('[data-case-title]')).toHaveText('Hinton Consulting');

  await expect(modal.locator('[data-case-block="challenge"]')).toBeVisible();
  await expect(modal.locator('[data-case-block="approach"]')).toBeVisible();
  await expect(modal.locator('[data-case-block="solution"]')).toBeVisible();

  await expect(modal.locator('[data-case-challenge]')).not.toHaveText('');
  await expect(modal.locator('[data-case-approach]')).not.toHaveText('');
  await expect(modal.locator('[data-case-solution]')).not.toHaveText('');

  await expect(modal.locator('[data-case-gallery]')).toHaveCount(1);
  await modal.locator('.case-close').click();
  await expect(modal).not.toHaveClass(/open/);
});

test('Contact CMS controls render without submitting the form', async ({ page }) => {
  await page.goto(origin + '/contact.html', { waitUntil: 'networkidle' });

  await expect.poll(async () =>
    page.evaluate(() => document.documentElement.dataset.cms || '')
  ).toBe('sanity');

  const projectOptions = page.locator('#project-form input[name="project_type"]');
  expect(await projectOptions.count()).toBeGreaterThan(0);

  await expect(page.locator('#project-form input[name="_honey"]')).toHaveCount(1);
  await expect(page.locator('#project-form [name="name"]')).toHaveAttribute('required', '');
  await expect(page.locator('#project-form [name="email"]')).toHaveAttribute('required', '');
  await expect(page.locator('#project-form [name="brief"]')).toHaveAttribute('required', '');
  await expect(page.locator('#project-form button[type="submit"]')).toBeVisible();
});

for (const route of routes) {
  test(route.name + ' has no mobile horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin + route.path, { waitUntil: 'networkidle' });

    await expect.poll(async () =>
      page.evaluate(() => document.documentElement.dataset.cms || '')
    ).toBe('sanity');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
}
