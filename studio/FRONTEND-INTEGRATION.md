# Frontend integration status

Designing Virtuosity now uses the existing GitHub Pages frontend as the presentation layer and Sanity as the published editorial content layer.

## Current architecture

- GitHub Pages retains the existing HTML/CSS/interaction design.
- Sanity project: `rx0hc1vo`
- Dataset: `production`
- Public site reads published content through `js/sanity-content.js`.
- No Sanity write token is exposed in the browser.
- Existing HTML remains the fallback if Sanity is unavailable.
- Both `https://designingvirtuosity.com` and `https://www.designingvirtuosity.com` are configured by the Studio deployment workflow as allowed Sanity frontend origins.

## Connected pages

1. Home
2. Services
3. Portfolio / Case Studies
4. Contact

All four pages load the same shared Sanity adapter.

## Global Site Settings

Shared settings control:

- site / brand name
- header meta line
- primary navigation
- footer meta and statement
- footer project CTA
- footer navigation columns
- social/contact links
- legal/business name
- established year
- footer location
- default SEO

## Contact-form boundary

Sanity may edit presentation and response copy, including:

- hero and inquiry copy
- project-type choices
- visible field labels and placeholders
- budget and timeline options
- source suggestions
- submit-button label
- form note
- success and error messages
- strategic-intelligence referral content

Sanity does not control:

- the FormSubmit endpoint
- form field names
- request method
- payload construction
- anti-spam honeypot
- submission subject/reply-to behavior

Those mechanics remain code-controlled so editorial changes cannot silently break lead capture.

## Portfolio evidence model

Portfolio projects retain explicit evidence controls:

- Documented Case Study
- Partial Evidence / Expandable
- Portfolio Artifact

Business-performance claims should only be added when supporting evidence exists.

## Editorial safety

The frontend only requests published Sanity documents. Drafts are not rendered on the public site. If the Content Lake request fails, the static HTML remains visible.

## Remaining launch decisions

Before changing the site from build/staging behavior to public search-discovery mode, review:

- page-level `noIndex` settings
- canonical URLs
- social-share images
- production portfolio media
- final contact-response wording
- any desired preview / draft workflow for editors

Do not place a Sanity write token in client-side JavaScript.
