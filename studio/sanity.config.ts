import {defineConfig, isDev} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'rx0hc1vo'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

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
