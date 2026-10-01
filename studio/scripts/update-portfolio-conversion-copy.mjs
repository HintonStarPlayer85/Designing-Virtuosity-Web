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

const page = await client.fetch('*[_id == "portfolioPage"][0]')
const projects = await client.fetch('*[_type == "portfolioProject"] | order(coalesce(featuredOrder, 999) asc, coalesce(portfolioOrder, 999) asc)')

if (!page) throw new Error('portfolioPage document was not found.')
if (projects.length !== 11) throw new Error(`Expected 11 portfolio projects, found ${projects.length}.`)

const canonical = (value = '') => String(value).replace(/\s+/g, '').toLowerCase()
const parity = {
  heroHeadingTop: 'Proof lives in',
  heroHeadingAccent: 'the work.',
  featuredHeading: 'Capability, in motion.',
  indexHeading: 'Browse the larger body of work.',
  identityHeading: 'Marks made to belong.',
  rangeHeading: "The work changes. The standard doesn't.",
  closingHeading: 'Your next project can live here.',
}

for (const [field, expected] of Object.entries(parity)) {
  // The original static Design Range section has no kicker, so the first migration
  // could not discover rangeHeading. Treat that one missing field as a known
  // migration gap and populate it below; all other brand anchors must match.
  if (field === 'rangeHeading' && !page[field]) continue
  if (canonical(page[field]) !== canonical(expected)) {
    throw new Error(`Parity check failed for ${field}. Expected "${expected}", found "${page[field]}".`)
  }
}

const pageChanges = {
  heroHeadingTop: 'Proof lives in',
  heroHeadingAccent: 'the work.',
  heroIntro:
    'Explore brand, web, UI/UX, corporate, campaign and information-design work selected to show how Designing Virtuosity solves different communication problems across organizations, audiences and environments.',

  featuredHeading: 'Capability, in motion.',
  featuredIntro:
    'These projects are featured because each demonstrates a different kind of design problem—from organizing complex services and long-form information to building integrated brand, digital and campaign systems.',

  indexHeading: 'Browse the larger body of work.',
  indexIntro:
    'Browse by discipline to see the wider range of work. Full case studies are reserved for projects with enough documented material to explain the challenge, approach and solution; smaller artifacts remain visible without overstating their scope.',

  identityHeading: 'Marks made to belong.',
  identityIntro:
    'Identity work ranges from standalone marks to expanded brand systems. Where supporting material exists, the identity connects to a broader digital or corporate experience; where it does not, the mark is presented on its own merits.',

  rangeHeading: "The work changes. The standard doesn't.",
  rangeIntro:
    'The engagement may be a single identity mark, a focused campaign or a complex digital environment. What stays consistent is the expectation for clarity, function, coherence and design that serves a defined purpose.',

  closingBody:
    'If you have a communication problem, a brand that has outgrown its current system, a digital experience that needs clarity or an idea that needs to become tangible, tell us what the work needs to accomplish.',

  seo: {
    ...page.seo,
    metaDescription:
      'Explore Designing Virtuosity portfolio work across brand systems, websites, UI/UX, corporate communications, campaigns and information design.',
  },
}

const projectContent = {
  'Hinton Consulting': {
    summary:
      'A multidisciplinary consulting firm translated into one coherent digital environment for behavioral healthcare, strategic intelligence, government contracting and organizational consulting.',
    challenge:
      'The organization spans several distinct consulting disciplines. The digital experience needed to make those service areas understandable without making the company feel fragmented or presenting each discipline as a separate brand.',
    strategy:
      'Organize the experience around clear consulting disciplines while keeping a shared corporate identity, navigation logic and visual language across the site.',
    designSystem:
      'A modular web and brand experience combining website strategy, UX/UI, development and reusable service architecture.',
    outcomes: [
      'Created one digital environment for multiple consulting disciplines',
      'Established a reusable structure for distinct service areas while maintaining brand unity',
      'Made complex service architecture easier to organize and present',
    ],
    evidenceStatus: 'documented',
    evidenceNote:
      'The live website and current project architecture support a qualitative case study. No traffic, conversion or revenue metrics are recorded in the portfolio dataset.',
  },

  'The VIBHA': {
    summary:
      'Institutional, educational and healthcare/research-oriented communication brought together within a shared digital and corporate design language.',
    challenge:
      'The work needed to accommodate institutional, educational, healthcare and research-oriented communication without creating disconnected visual experiences for each function.',
    strategy:
      'Use a consistent design language across the web and corporate communication environment so varied content can still feel part of one institution.',
    designSystem:
      'A web and corporate communication framework supporting digital experience, institutional communication and brand application.',
    outcomes: [
      'Established a shared visual framework across institutional and educational communication',
      'Created a digital foundation capable of carrying multiple types of organizational content',
    ],
    evidenceStatus: 'partial',
    evidenceNote:
      'The live website and current narrative support the core story. Approved portfolio screens and a deeper case-study narrative are still needed before treating this as a fully documented case study.',
  },

  'Supported Counsel': {
    summary:
      'A connected brand and website project with a distinct visual direction, extending the portfolio beyond Designing Virtuosity’s other healthcare and corporate environments.',
    challenge:
      'The project needed a cohesive identity and digital expression that could carry across typography, color, brand application and website experience without borrowing the visual language of unrelated healthcare projects.',
    strategy:
      'Develop the identity and web experience as one connected system so the visual language could move consistently from the mark into digital application.',
    designSystem:
      'Brand identity and website application expressed through a coordinated visual and digital system.',
    outcomes: [
      'Connected the identity and website into one recognizable visual direction',
      'Created a brand expression that can extend across future digital applications',
    ],
    evidenceStatus: 'partial',
    evidenceNote:
      'The identity and live website are documented. Additional approved screenshots and broader brand applications are still needed for a deeper case study.',
  },

  "Ervin's Village": {
    summary:
      'A service organization expressed through a complete brand and digital experience rather than a collection of disconnected visual assets.',
    challenge:
      'The organization needed its identity, website and related visual applications to work as one system instead of separate design pieces.',
    strategy:
      'Build the brand identity and digital experience together so typography, color, visual language and website application reinforce the same organizational presence.',
    designSystem:
      'An expanded brand system combining identity, digital experience and visual application across multiple touchpoints.',
    outcomes: [
      'Connected brand identity and website experience into one system',
      'Created a visual foundation that can extend into additional organizational materials',
    ],
    evidenceStatus: 'documented',
    evidenceNote:
      'The identity and live website support a substantive qualitative case study. Additional approved collateral can expand the story further; no performance metrics are currently documented.',
  },

  'Hinton Consulting Corporate Capabilities': {
    summary:
      'Executive-level corporate communication that organizes dense service and capability information into a structured, credible publication.',
    challenge:
      'A complex consulting organization needed to communicate a large amount of capability information in a format that decision-makers could scan, understand and use without losing the depth of the underlying services.',
    strategy:
      'Prioritize information hierarchy, executive readability and structured service architecture so dense content can be navigated quickly.',
    designSystem:
      'A corporate capabilities publication built around modular information architecture, hierarchy and executive communication.',
    outcomes: [
      'Organized complex capability information into a more usable executive format',
      'Created a reusable publication structure for presenting multidisciplinary services',
      'Strengthened visual consistency across high-stakes corporate communication',
    ],
    evidenceStatus: 'documented',
    evidenceNote:
      'The completed capabilities document supports a qualitative information-design case study. Procurement or business-development performance metrics are not documented in the portfolio dataset.',
  },

  'The VIBHA Course Catalog': {
    summary:
      'Long-form educational content organized through publication hierarchy, structure and information design.',
    challenge:
      'The catalog needed to hold substantial educational information while remaining navigable, legible and useful to readers moving between courses and program information.',
    strategy:
      'Use clear hierarchy, repeatable publication patterns and disciplined information structure to make long-form content easier to scan and navigate.',
    designSystem:
      'A structured course-catalog publication system for educational communication and long-form information design.',
    outcomes: [
      'Made long-form educational content more navigable and legible',
      'Established repeatable hierarchy for course and program information',
    ],
    evidenceStatus: 'partial',
    evidenceNote:
      'The catalog is an approved portfolio project. Final selected spreads should be added to Sanity before treating the record as a fully documented case study.',
  },

  'Wildside Kitchen — Dining Experience': {
    summary:
      'Consumer-facing hospitality design connecting menu communication and QR interaction as parts of one dining experience.',
    challenge:
      'The menu and QR touchpoint needed to function as a connected customer experience rather than unrelated physical and digital deliverables.',
    strategy:
      'Treat the physical menu and QR interaction as complementary touchpoints within the same hospitality visual direction.',
    designSystem:
      'Menu design, QR experience and hospitality creative developed as a coordinated dining communication system.',
    outcomes: [
      'Connected physical menu design and digital QR interaction',
      'Created a consistent consumer-facing hospitality experience across two touchpoints',
    ],
    evidenceStatus: 'partial',
    evidenceNote:
      'The menu and QR work are documented. Additional campaign or dining-experience assets would be needed to support a deeper case study.',
  },

  'Are You Ready? Behavioral Health Licensing Campaign': {
    summary:
      'Behavioral-health licensing campaign creative structured as a coordinated promotional system rather than a single standalone graphic.',
    challenge:
      'The campaign needed a recognizable message that could carry across multiple promotional assets without each piece feeling like a separate idea.',
    strategy:
      'Use one campaign concept and repeatable visual language so the message can extend across a coordinated sequence of promotional materials.',
    designSystem:
      'Campaign strategy and marketing creative organized as a reusable behavioral-health promotional system.',
    outcomes: [
      'Established a coordinated visual direction for the campaign',
      'Created a system capable of carrying one message across multiple promotional assets',
    ],
    evidenceStatus: 'partial',
    evidenceNote:
      'The campaign concept and creative are documented. The full asset sequence should be added to Sanity before this is presented as a complete case study.',
  },

  'Village Impact Network': {
    summary:
      'A full website experience representing the broader Web + Digital portfolio.',
    challenge:
      'The available portfolio record documents a complete website project but does not yet contain enough approved narrative to state a more specific client problem without inference.',
    strategy:
      'Treat the work as a complete web experience and preserve the project as a portfolio artifact until stronger case-study evidence is available.',
    designSystem:
      'Full website experience.',
    outcomes: [],
    evidenceStatus: 'partial',
    evidenceNote:
      'A live website is documented. Additional approved project rationale, screenshots and outcome evidence are required before expanding this record into a case study.',
  },

  'Campaign Landing Environments': {
    summary:
      'ACT Consulting and VASCUPP Consulting grouped as focused landing environments built around narrower conversion goals than full-site architecture.',
    challenge:
      'These engagements required focused landing experiences where the communication task was narrower than a complete website and the user path needed to remain concentrated on a specific offer or initiative.',
    strategy:
      'Keep each environment intentionally focused and group the two projects as one portfolio treatment rather than inflating them into thin individual case studies.',
    designSystem:
      'Two focused landing-page environments for ACT Consulting and VASCUPP Consulting.',
    outcomes: [
      'Demonstrates focused landing-page architecture as a distinct capability from full-site design',
      'Preserves a concentrated communication path around a defined offer or initiative',
    ],
    evidenceStatus: 'partial',
    evidenceNote:
      'Both landing environments are documented as portfolio artifacts. Conversion metrics are not currently recorded, so no performance claims should be added.',
  },

  'Earnest Heart Foundation One Sheet': {
    summary:
      'A focused nonprofit communication piece that demonstrates compact information design alongside larger corporate publications.',
    challenge:
      'The project required nonprofit information to be presented in a concise one-sheet format without the space available in a longer publication.',
    strategy:
      'Use hierarchy and disciplined content structure to concentrate the most important information into a smaller communication format.',
    designSystem:
      'One-sheet nonprofit communication and information-design artifact.',
    outcomes: [
      'Created a compact visual format for nonprofit communication',
      'Demonstrates information hierarchy at a smaller publication scale',
    ],
    evidenceStatus: 'artifact',
    evidenceNote:
      'The one-sheet is intentionally retained as a portfolio artifact. The current record does not support a standalone case study or business-performance claims.',
  },
}

let tx = client.transaction().patch('portfolioPage', (patch) => patch.set(pageChanges))

for (const project of projects) {
  const changes = projectContent[project.title]
  if (!changes) throw new Error(`No conversion-copy mapping for portfolio project: ${project.title}`)
  tx = tx.patch(project._id, (patch) => patch.set(changes))
}

await tx.commit({visibility:'sync'})

const verifyPage = await client.fetch('*[_id == "portfolioPage"][0]{heroHeadingTop,heroHeadingAccent,featuredHeading,indexHeading,identityHeading,rangeHeading,closingHeading,heroIntro,closingBody}')
const verifyProjects = await client.fetch('*[_type == "portfolioProject"] | order(title asc){title,evidenceStatus,challenge,strategy,designSystem,outcomes}')

console.log('Portfolio conversion-copy update complete.')
console.log('Page fields changed:', Object.keys(pageChanges).join(', '))
console.log('Portfolio projects updated:', verifyProjects.length)
console.log('Preserved headings:', [
  verifyPage.heroHeadingTop + ' ' + verifyPage.heroHeadingAccent,
  verifyPage.featuredHeading,
  verifyPage.indexHeading,
  verifyPage.identityHeading,
  verifyPage.rangeHeading,
  verifyPage.closingHeading,
].join(' | '))
console.log('Evidence status counts:', JSON.stringify(verifyProjects.reduce((acc,p)=>{acc[p.evidenceStatus]=(acc[p.evidenceStatus]||0)+1;return acc},{})))
console.log('All projects have challenge/strategy/system:', verifyProjects.every((p)=>p.challenge && p.strategy && p.designSystem))
