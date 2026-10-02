# Frontend integration status

Designing Virtuosity now uses the existing GitHub Pages frontend as the presentation layer and Sanity as the published editorial content layer.

## Current architecture

- GitHub Pages retains the existing HTML/CSS/interaction design.
- Sanity project: `rx0hc1vo`
- Dataset: `production`
- Public site reads published content through `js/sanity-content.js`.
- No Sanity write token is exposed in the browser.
- Existing HTML remains the fallback if Sanity is unavailable.
- Both `https://designingvirtuosity.com` and `https://www.designingvirtuosity.com` are configured by the Studio deployment workflow as allowed Sanity frontend origins without credentials.

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

## Media integration

### Services client logos

Selected Client Experience now prefers each Client document's Sanity `logo` asset. The original `legacyLogoPath` remains as a safe fallback, so existing logos continue to render until replacement assets are uploaded into Sanity.

### Portfolio media

Portfolio projects support:

- Sanity cover image
- Sanity gallery images with alt text
- legacy visual shells when no CMS image is supplied

Gallery images render inside the case-study modal under Selected Work. The gallery is hidden automatically when no media has been added.

Identity Archive marks prefer the Sanity `logo` asset and retain the existing legacy identity treatment as fallback.

## Portfolio case-study model

Case-study content is structurally separated into:

- Project Context
- Challenge
- Approach
- Solution

Solution receives stronger visual emphasis in the frontend. Empty Challenge or Approach sections are hidden rather than presenting blank headings.

Portfolio projects retain explicit evidence controls:

- Documented Case Study
- Partial Evidence / Expandable
- Portfolio Artifact

Business-performance claims should only be added when supporting evidence exists.

## Contact-form boundary

Sanity may edit presentation and response copy, including:

- hero and inquiry copy
- project-type prompt and choices
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

## Migration defaults

The Studio deployment workflow runs `scripts/finalize-migration-defaults.mjs`.

It uses `setIfMissing` so these post-migration fields are populated without overwriting future editorial changes:

- Site Settings → Header Meta Line
- Site Settings → Footer Location
- Contact Page → Project Type Prompt

## Deployment behavior

The Studio deployment workflow now:

1. installs Studio dependencies
2. finalizes any missing migration defaults
3. verifies/adds the apex and www CORS origins without credentials
4. deploys the current Studio and schema

The workflow supports manual dispatch and push-triggered deployment for Studio/schema changes.

## Editorial safety

The frontend only requests published Sanity documents. Drafts are not rendered on the public site. If the Content Lake request fails, the static HTML remains visible.

## Migration closeout status

### Complete

- Sanity content model
- initial content migration
- conversion-focused Home copy
- conversion-focused Services copy
- evidence-controlled Portfolio content
- Home frontend integration
- Services frontend integration
- Portfolio frontend integration
- Contact frontend integration
- global Site Settings integration
- Sanity client-logo support
- Portfolio cover-image support
- Portfolio gallery support
- Identity Archive Sanity image support
- Challenge / Approach / Solution modal structure
- CORS deployment automation
- migration-default finalization
- static HTML fallback architecture
- manual production SEO launch workflow

### Operational confirmation still required

1. Run or confirm a successful **Deploy Sanity Studio** workflow after the latest schema/deployment changes.
2. Confirm the four public pages are receiving Sanity content in the production browser.
3. Test one Contact form submission end-to-end.
4. Inspect desktop and mobile layouts after production deployment.

These are deployment/runtime confirmations, not unfinished migration architecture.

## Search indexing

The site remains intentionally in build/staging search mode. Static pages currently retain `noindex, nofollow`.

Do not enable production indexing until production runtime QA is complete.

When approved, use the manual **Launch Production SEO** workflow. It is designed to update both Sanity SEO state and the static HTML fallback together.

## Optional post-migration enhancements

These are not blockers to closing the migration:

- editor preview / draft workflow
- scheduled publishing
- role-based editorial permissions
- social-share images
- richer image captions / media metadata
- additional case-study templates

Do not place a Sanity write token in client-side JavaScript.
