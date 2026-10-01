# Frontend integration plan

The current Designing Virtuosity website is intentionally unchanged during CMS setup.

## Phase 1 — Studio
Create the Sanity project, deploy the Studio, and enter/migrate content.

## Phase 2 — Read adapter
Add a public, read-only Sanity client to the existing static site. No browser token is permitted.

Recommended API configuration:
- projectId: public project ID
- dataset: production
- apiVersion: 2026-10-01
- useCdn: true for published site content

## Phase 3 — Page-by-page migration
Migrate one page at a time:
1. Home
2. Services
3. Portfolio / Case Studies
4. Contact

Each page keeps its present HTML/CSS structure. Sanity supplies text, links, images, ordering, and portfolio records.

## Phase 4 — Conversion copy
Rewrite copy inside Sanity using separate fields for:
- brand statement
- client problem
- value promise
- business outcome
- proof
- next action

This prevents the site from drifting back into design-description language.

## Phase 5 — Editorial controls
Once stable, add preview/draft workflow, scheduled publishing if needed, and role-based access.
