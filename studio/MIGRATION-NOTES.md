# Existing website content migration

The migration script reads the current production-facing static HTML and writes structured Sanity documents. It does not change the public website.

## What is migrated

- Site navigation and footer content
- Home page visible copy, selected-work cards, capabilities, philosophy, evolution timeline, CTA and SEO metadata
- Services page hero, all six service panels, process, selected client experience, differentiators, FAQ, CTA and SEO metadata
- Portfolio page hero and section copy
- Featured portfolio projects and Portfolio Index entries
- Identity Archive records and their current static asset/class references
- Contact page visible copy, form option labels, form status copy, Strategic Intelligence referral content and SEO metadata

## Asset handling

The first migration records current static asset paths for logos/media instead of moving binary assets into Sanity. This protects the existing site and gives the Studio a complete content inventory first. Media can be uploaded into Sanity in a separate controlled pass.

## Safety

The migration is idempotent and uses deterministic document IDs. It is intended for the initial migration only because re-running it after editorial changes would replace the migrated fields with the current static-site values.

The public website remains static until a separate reviewed frontend integration is approved.
