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

const current = await client.fetch('*[_id == "homePage"][0]')
if (!current) throw new Error('homePage document was not found.')

const requiredParity = {
  heroHeadlineTop: 'Design beyond',
  heroHeadlineAccent: 'decoration.',
  capabilitiesHeading: 'Systems, not isolated assets.',
  philosophyHeading: 'Design should solve something.',
}

for (const [field, expected] of Object.entries(requiredParity)) {
  if (current[field] !== expected) {
    throw new Error(`Parity check failed for ${field}. Expected "${expected}", found "${current[field]}".`)
  }
}

const mergeByTitle = (items = [], replacements = {}) =>
  items.map((item) => ({
    ...item,
    ...(replacements[item.title] || {}),
  }))

const proofCards = mergeByTitle(current.proofCards, {
  'Digital Experience System': {
    description: 'A high-clarity interface system designed to make complex information easier to navigate, understand and act on.',
  },
  'Brand System': {
    description: 'A cohesive identity system built to strengthen recognition and carry consistently across digital and physical touchpoints.',
  },
  'Capability Suite': {
    description: 'Executive-ready corporate communications designed to organize complex information, strengthen credibility and support business development.',
  },
})

const capabilityHighlights = mergeByTitle(current.capabilityHighlights, {
  'Brand Systems': {
    description: 'Build a recognizable, scalable identity that keeps your organization consistent across every audience touchpoint.',
  },
  'Web + Digital': {
    description: 'Turn your website or landing environment into a clear, credible path for audiences to understand, trust and act.',
  },
  'UI / UX': {
    description: 'Simplify complex workflows and digital products so users can navigate with confidence and less friction.',
  },
  'Corporate Design': {
    description: 'Present your organization with the clarity and credibility required for executives, partners, funders and procurement environments.',
  },
  'Campaign Creative': {
    description: 'Launch ideas with a cohesive visual system that stays recognizable across digital, social and promotional channels.',
  },
  'Information Design': {
    description: 'Transform dense content, reports and presentations into visual communication people can understand quickly.',
  },
})

const principles = mergeByTitle(current.principles, {
  'Purpose before polish': {
    description: 'We define the audience, decision and outcome the work must support before visual direction begins.',
  },
  'Systems over one-offs': {
    description: 'Your investment should extend beyond one deliverable. We design systems that can scale across websites, print, social, digital products and future applications.',
  },
  'Experience matters': {
    description: 'We design around the people using the work so every interaction feels clear, credible and intentional.',
  },
})

const changes = {
  heroSupportingCopy:
    'We help organizations turn complex ideas, services and growth plans into clear brand systems, strategic websites, intuitive digital experiences and professional communications that help audiences understand, trust and act.',

  proofClientCopy:
    'See how we translate complex organizations and ideas into clear, credible experiences across brand, web, interface and corporate communications. Each project is selected to show the problem solved—not just the finished aesthetic.',

  proofCards,

  capabilitiesIntro:
    'Whether you need to launch, reposition, explain something complex or improve how people experience your organization, we build connected design systems that work across the places your audience actually encounters your brand.',

  capabilityHighlights,

  philosophyParagraphs: [
    'We do not begin with decoration. We begin with purpose.',
    'Every website, identity, interface, campaign and visual system has a job to do—communicate an idea, guide an action, establish trust, simplify complexity or move an organization forward.',
    'Designing Virtuosity combines visual design, digital thinking and strategic execution so the finished work is distinctive, useful and built to perform a clear communication or business function.',
  ],

  principles,

  aboutParagraphs: [
    'Designing Virtuosity began in 2009 as a graphic design studio and has evolved with the organizations we serve.',
    'What started with visual identities, print design and marketing materials expanded into websites, digital experiences, interface design, brand systems and technology-enabled business solutions—giving clients one creative partner across more of their growth.',
    'That history matters. Since 2009, we have built our work around strong concepts, disciplined composition, organizational context and design with intention—then expanded those fundamentals across the platforms and experiences modern organizations now require.',
  ],

  closingBody:
    'Tell us what you are building, what needs to change and what the work needs to accomplish. We will identify the right design system for the job.',

  seo: {
    ...current.seo,
    metaDescription:
      'Designing Virtuosity creates brand systems, websites, UI/UX, corporate design and campaign creative that help organizations communicate clearly, build trust and grow.',
  },
}

const updated = await client.patch('homePage').set(changes).commit({visibility: 'sync'})

const changedFields = Object.keys(changes)
console.log('Homepage conversion-copy update complete.')
console.log('Document:', updated._id)
console.log('Changed fields:', changedFields.join(', '))
console.log('Preserved headline:', updated.heroHeadlineTop, updated.heroHeadlineAccent)
console.log('Preserved capabilities heading:', updated.capabilitiesHeading)
console.log('Preserved philosophy heading:', updated.philosophyHeading)
