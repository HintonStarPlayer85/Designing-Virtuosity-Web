import {createClient} from '@sanity/client'
import {readFileSync, writeFileSync} from 'node:fs'
import {resolve, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../..')

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

const pages = [
  {id: 'homePage', file: 'index.html', url: 'https://designingvirtuosity.com/'},
  {id: 'servicesPage', file: 'services.html', url: 'https://designingvirtuosity.com/services.html'},
  {id: 'portfolioPage', file: 'portfolio.html', url: 'https://designingvirtuosity.com/portfolio.html'},
  {id: 'contactPage', file: 'contact.html', url: 'https://designingvirtuosity.com/contact.html'},
]

for (const page of pages) {
  const current = await client.fetch('*[_id == $id][0]{seo}', {id: page.id})
  if (!current) throw new Error(`Missing Sanity document: ${page.id}`)

  await client.patch(page.id).set({
    seo: {
      ...(current.seo || {_type: 'seoFields'}),
      _type: 'seoFields',
      canonicalUrl: page.url,
      noIndex: false,
    },
  }).commit({visibility: 'sync'})

  const path = resolve(repoRoot, page.file)
  let html = readFileSync(path, 'utf8')

  html = html.replace(
    /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>/i,
    '<meta name="robots" content="index, follow">'
  )

  const canonical = `<link rel="canonical" href="${page.url}">`
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonical)
  } else {
    const descriptionMeta = html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0]
    if (!descriptionMeta) throw new Error(`Could not find description meta tag in ${page.file}`)
    html = html.replace(descriptionMeta, `${descriptionMeta}\n  ${canonical}`)
  }

  writeFileSync(path, html)
  console.log(`Prepared ${page.file}: index, follow + ${page.url}`)
}

const settings = await client.fetch('*[_id == "siteSettings"][0]{defaultSeo}')
if (!settings) throw new Error('Missing siteSettings document.')

await client.patch('siteSettings').set({
  defaultSeo: {
    ...(settings.defaultSeo || {_type: 'seoFields'}),
    _type: 'seoFields',
    canonicalUrl: 'https://designingvirtuosity.com/',
    noIndex: false,
  },
}).commit({visibility: 'sync'})

console.log('Production SEO launch settings updated in Sanity.')
console.log('Static HTML launch settings prepared for Git commit.')
