# Designing Virtuosity Digital Media — Static Website Prototype

Four-page static build:

- `index.html` — Home
- `services.html` — Services
- `portfolio.html` — Portfolio / Case Studies
- `contact.html` — Contact Us

## Technical approach

Pure HTML, CSS and JavaScript. No framework, CMS or database is required. The site includes responsive navigation, animated gradients, scroll reveals, hover interactions, magnetic buttons, service accordions, portfolio filtering, full-screen case-study overlays, deep-linkable portfolio items, reduced-motion support and front-end contact-form validation.

## Before public launch

1. Replace representative portfolio shells with actual Designing Virtuosity projects and approved project imagery.
2. Confirm the exact brand typeface. The prototype currently uses Space Grotesk + Manrope as interface fonts; the supplied logo itself is preserved unchanged.
3. Connect the contact form to a secure mail/form endpoint compatible with the selected GoDaddy hosting plan.
4. Add the production domain to canonical/Open Graph metadata after DNS is finalized.
5. Compress portfolio imagery to modern WebP/AVIF where practical.
6. Run final accessibility, responsive, Lighthouse and cross-browser QA.

## GoDaddy deployment

Upload the contents of this folder to the hosting account's web root (commonly `public_html`). Keep the folder structure intact so `css/`, `js/` and `assets/` paths resolve correctly.

## GitHub workflow

The same folder can be stored in GitHub for version control while GoDaddy remains the production host.
