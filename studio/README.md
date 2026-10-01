# Designing Virtuosity Content Studio

This directory contains the Sanity Studio for DesigningVirtuosity.com.

## Architecture

The public website remains the existing static HTML/CSS/JavaScript site. This Studio is a separate editing layer backed by Sanity Content Lake. The public site should not be switched to Sanity until content parity has been reviewed.

## First-time setup

1. Create or open the Designing Virtuosity project in Sanity.
2. Copy `.env.example` to `.env`.
3. Set:
   - `SANITY_STUDIO_PROJECT_ID`
   - `SANITY_STUDIO_DATASET=production`
4. Run `npm install`.
5. Run `npm run dev`.

Current Sanity Studio requires Node.js 22.12 or later.

## Content model

The Studio is intentionally buyer-facing. It separates premium brand language from conversion copy.

Singletons:
- Site Settings
- Home Page
- Services Page
- Contact Page

Collections:
- Services
- Clients
- Portfolio Projects
- Identity Archive

Portfolio records support three levels:
- Featured Project
- Case Study
- Portfolio Artifact

## Security

Never commit a Sanity API token. The public website should not contain a write token. Public read access can use the project ID and dataset once the frontend integration is activated.

## Deployment

Sanity-hosted Studio is preferred initially. A manual GitHub Actions workflow is included and can be activated after repository variables/secrets are configured.

Recommended Studio hostname:
`designing-virtuosity.sanity.studio`

## Production migration rule

Do not replace live page copy with CMS output until:
1. the relevant Sanity documents exist,
2. the content has been reviewed,
3. the frontend query returns complete data,
4. a fallback exists for a failed API request,
5. the visual layout has been regression-tested.
