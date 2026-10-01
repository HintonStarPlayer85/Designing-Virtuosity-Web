import {defineConfig, isDev} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID. Copy .env.example to .env and add the Sanity project ID.')
}

export default defineConfig({
  name: 'designing-virtuosity',
  title: 'Designing Virtuosity Content Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({structure}),
    ...(isDev ? [visionTool({defaultApiVersion: '2026-10-01'})] : []),
  ],
  schema: {
    types: schemaTypes,
  },
})
