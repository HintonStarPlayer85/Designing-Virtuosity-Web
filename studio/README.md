# Designing Virtuosity Content Studio

This directory contains the Sanity Studio for DesigningVirtuosity.com.

## Connected Sanity project

- Project ID: `rx0hc1vo`
- Dataset: `production`
- Preferred Studio hostname: `designing-virtuosity.sanity.studio`

The project ID is public configuration, not a secret. Authentication/write tokens must never be committed.

## Architecture

The public website remains the existing static HTML/CSS/JavaScript site. This Studio is a separate editing layer backed by Sanity Content Lake. The public site should not be switched to Sanity until content parity has been reviewed.

## Local setup

1. Run `npm install` inside this directory.
2. Run `npm run dev`.

The Studio already defaults to project `rx0hc1vo` and dataset `production`, so a local `.env` is optional unless an environment needs to override them.

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

Sanity-hosted Studio is preferred initially. A manual GitHub Actions workflow is included. It already knows the project ID, dataset, and preferred hostname; it only requires the repository secret `SANITY_AUTH_TOKEN` before the workflow can deploy.

## Production migration rule

Do not replace live page copy with CMS output until:
1. the relevant Sanity documents exist,
2. the content has been reviewed,
3. the frontend query returns complete data,
4. a fallback exists for a failed API request,
5. the visual layout has been regression-tested.
