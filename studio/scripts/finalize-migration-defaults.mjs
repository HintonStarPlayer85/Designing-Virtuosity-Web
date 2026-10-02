import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'rx0hc1vo'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_CONTENT_TOKEN || process.env.SANITY_AUTH_TOKEN

if (!token) throw new Error('Missing SANITY_CONTENT_TOKEN or SANITY_AUTH_TOKEN.')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-10-01',
  useCdn: false,
})

const patches = [
  {
    id: 'siteSettings',
    values: {
      headerMeta: 'Digital Media · Est. 2009',
      locationLabel: 'North Carolina',
    },
  },
  {
    id: 'contactPage',
    values: {
      projectTypePrompt: 'What are we creating?',
    },
  },
]

for (const item of patches) {
  const exists = await client.fetch('defined(*[_id == $id][0]._id)', {id: item.id})
  if (!exists) throw new Error(`Missing required Sanity document: ${item.id}`)

  await client
    .patch(item.id)
    .setIfMissing(item.values)
    .commit({visibility: 'sync'})

  console.log(`Verified migration defaults for ${item.id}: ${Object.keys(item.values).join(', ')}`)
}

console.log('Sanity migration defaults finalized without overwriting existing editorial values.')
