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

const page = await client.fetch('*[_id == "servicesPage"][0]')
const services = await client.fetch('*[_type == "service"] | order(displayOrder asc)')

if (!page) throw new Error('servicesPage document was not found.')
if (services.length !== 6) throw new Error(`Expected 6 service documents, found ${services.length}.`)

const parity = {
  heroHeading: 'One studio. Six design systems.',
  processHeading: 'From ambiguity to system.',
  experienceHeading: 'From emerging brands to major institutions.',
  differenceHeading: 'Built beyond the deliverable.',
  faqHeading: 'A few things worth knowing.',
  closingMessage: 'Need a design system, not just a file?',
}

const canonical = (value = '') => String(value).replace(/\s+/g, '').toLowerCase()

for (const [field, expected] of Object.entries(parity)) {
  if (canonical(page[field]) !== canonical(expected)) {
    throw new Error(`Parity check failed for ${field}. Expected "${expected}", found "${page[field]}".`)
  }
}

const serviceTitles = services.map((service) => service.title)
const expectedTitles = ['Brand Systems','Web + Digital','UI / UX Design','Corporate Design','Campaign Creative','Information Design']
for (const title of expectedTitles) {
  if (!serviceTitles.includes(title)) throw new Error(`Missing expected service document: ${title}`)
}

const mergeByTitle = (items = [], replacements = {}) =>
  items.map((item) => ({...item, ...(replacements[item.title] || {})}))

const processSteps = mergeByTitle(page.processSteps, {
  'Understand': {
    description: 'We clarify the audience, objectives, constraints, decision points and success criteria so the project starts with a shared definition of the problem.',
  },
  'Architect': {
    description: 'We organize content, hierarchy, user flow and visual direction into a clear system before production begins.',
  },
  'Build': {
    description: 'We create the core deliverables and reusable components, with review points that keep the work aligned to the agreed objective.',
  },
  'Validate': {
    description: 'We test for usability, consistency, responsiveness and production readiness so the system works beyond the presentation.',
  },
})

const differenceCards = mergeByTitle(page.differenceCards, {
  'We think in systems.': {
    clientBenefit: 'You should not have to rebuild the visual logic every time your organization adds a page, campaign, service or platform. We design the core system so future work has somewhere to belong.',
  },
  'Strategy and design stay connected.': {
    clientBenefit: 'The work is shaped by audience, communication goals, usability and business purpose—not aesthetics in isolation—so each design decision supports something the organization actually needs to accomplish.',
  },
  'We understand organizations.': {
    clientBenefit: 'Our work is informed by experience across business operations, healthcare, nonprofit organizations, consulting and entrepreneurship. That context helps us design for real approval processes, stakeholders and operational environments.',
  },
  'We build for what comes next.': {
    clientBenefit: 'The finished project should create room to grow. We build visual and digital systems that can evolve as your services, technology, team and audience change.',
  },
})

const faq = (page.faq || []).map((item) => {
  const answers = {
    'What types of organizations do you work with?':
      'We work with startups, established businesses, nonprofits, consultants, healthcare organizations and institutions. Fit is determined less by organization size than by whether there is a clear communication, brand, digital or information problem we can solve well.',
    'Do you take one-time design projects?':
      'Yes. A full design system is not required for every engagement. We take focused projects when the scope and objective are clear, including websites, marketing materials, presentations, publications, campaigns and other defined creative deliverables.',
    'Can you work with an existing brand?':
      'Yes. We can work within established brand standards, extend an existing visual system or identify where the current system needs refinement. A rebrand is only recommended when the existing identity is genuinely limiting the work.',
    'Do you build websites as well as design them?':
      'Yes. Website engagements can include strategy, content structure, UX/UI design, responsive development and launch support. The technology and hosting approach are selected around the requirements of the project rather than forcing every client into the same stack.',
    'How long does a project take?':
      'Timeline depends on scope, complexity, content readiness and review cycles. Smaller creative projects may take days or weeks; websites, brand systems and larger digital engagements require longer development cycles. The schedule and client review points are established before work begins.',
    'How many revisions are included?':
      'Revision structure depends on the engagement. Each proposal identifies review stages, revision allowances and approval points so both sides know how feedback will be handled before production begins.',
    'Will we own the final files?':
      'Final approved deliverables and usage rights are defined in the project agreement. Where applicable, clients receive the production-ready files and assets required to use and maintain the completed work.',
    'What happens after the project launches?':
      'You can close the engagement after delivery or continue with maintenance, future design work, campaign development, digital expansion or ongoing creative support. The relationship can stay project-based or grow with your needs.',
  }
  return {...item, answer: answers[item.question] || item.answer}
})

const pageChanges = {
  heroHeading: 'One studio. Six design systems.',
  differenceHeading: 'Built beyond the deliverable.',
  faqHeading: 'A few things worth knowing.',

  heroClientValue:
    'From identity and web to UI/UX, corporate communications and campaigns, we help organizations clarify what they need to say, strengthen how they show up, and build design systems that can scale with the work.',

  processIntro:
    'Our process is structured to reduce ambiguity early. We define the problem, organize the system, build the right deliverables and validate the work in the context where it will actually be used.',

  processSteps,

  experienceCopy:
    'Our work has supported independent businesses, nonprofits, healthcare organizations, corporations and national institutions. That range matters because it means we know how to adapt the design process to different audiences, approval structures, operational realities and levels of complexity.',

  differenceIntro:
    'The value of good design is not the presentation file. It is what the work makes easier afterward—clearer communication, stronger consistency, more credible materials, better user experiences and a system your organization can keep using.',

  differenceCards,

  faqIntro:
    'A strong creative engagement starts with clear expectations. These answers cover the questions that most often affect scope, timing, ownership and how we work together.',

  faq,

  closingBody:
    'Tell us what is changing, what is not working, or what you are preparing to launch. We will help define the right scope before the design work begins.',

  seo: {
    ...page.seo,
    metaDescription:
      'Explore Designing Virtuosity services for brand systems, websites, UI/UX, corporate design, campaigns and information design built to help organizations communicate clearly and grow.',
  },
}

const serviceContent = {
  'Brand Systems': {
    shortDescription: 'Build a brand people can recognize, trust and use consistently across every touchpoint.',
    clientProblem: 'Your organization may have a logo but no reliable system for applying it across websites, documents, campaigns, social media and physical materials. As the organization grows, inconsistency begins to weaken recognition and credibility.',
    valuePromise: 'A scalable visual identity that gives your team clear rules, reusable assets and a consistent way to show up wherever the brand appears.',
    whatWeBuild: 'We develop the visual foundation and practical standards needed to move from a one-off logo to a working brand system that can be used by internal teams, vendors and future creative partners.',
    businessOutcomes: [
      'Stronger brand recognition',
      'More consistent client-facing communications',
      'Faster production across teams and vendors',
      'A visual system that can expand with new services, campaigns and channels',
    ],
    idealClient: 'Organizations launching a new brand, repositioning an existing one, or outgrowing a logo-only identity.',
    cta: {_type:'cta', label:'Build My Brand System', href:'contact.html', style:'primary'},
  },

  'Web + Digital': {
    shortDescription: 'Turn your website or digital environment into a clear, credible path from first impression to action.',
    clientProblem: 'Your website may look dated, feel fragmented, bury important information or make it difficult for users to understand what you offer and what they should do next.',
    valuePromise: 'A responsive digital experience that makes your organization easier to understand, easier to trust and easier to engage.',
    whatWeBuild: 'We combine content hierarchy, responsive design, interaction and development to create websites, landing pages and digital prototypes that work across devices and support a clear user journey.',
    businessOutcomes: [
      'Clearer communication of services and value',
      'Stronger digital credibility',
      'More intentional paths to inquiry, booking or action',
      'A scalable foundation for future digital growth',
    ],
    idealClient: 'Organizations launching a new site, replacing an outdated one, introducing a new offer or needing a focused landing environment for a campaign or initiative.',
    cta: {_type:'cta', label:'Plan My Digital Experience', href:'contact.html', style:'primary'},
  },

  'UI / UX Design': {
    shortDescription: 'Make complex digital products, tools and workflows easier for people to understand and use.',
    clientProblem: 'Your application, dashboard or internal workflow may contain the right functionality but still create friction because users struggle to find information, understand the next step or complete tasks confidently.',
    valuePromise: 'An interface system that organizes complexity, improves navigation and gives users a clearer path through the experience.',
    whatWeBuild: 'We map user flows, information hierarchy and interface patterns, then translate them into screens, dashboards and reusable components designed around real tasks rather than decoration.',
    businessOutcomes: [
      'Lower cognitive load for users',
      'Clearer navigation and task flow',
      'More consistent interface behavior',
      'A reusable design system for future product development',
    ],
    idealClient: 'Organizations developing or improving software, dashboards, portals, internal tools or digital products with complex user journeys.',
    cta: {_type:'cta', label:'Improve My User Experience', href:'contact.html', style:'primary'},
  },

  'Corporate Design': {
    shortDescription: 'Give important organizational materials the clarity and credibility required in high-stakes environments.',
    clientProblem: 'Your organization may have strong capabilities, data or strategy, but the documents representing that work do not communicate with the same level of authority—especially with executives, funders, partners or procurement teams.',
    valuePromise: 'Professional communications that organize complex information, strengthen credibility and help decision-makers understand what matters quickly.',
    whatWeBuild: 'We design capability statements, annual reports, manuals, guides and executive materials with a disciplined hierarchy that supports both readability and institutional credibility.',
    businessOutcomes: [
      'Stronger executive and institutional presentation',
      'Clearer communication of complex organizational information',
      'More consistent high-stakes materials',
      'Reusable document systems for future reporting and business development',
    ],
    idealClient: 'Organizations preparing materials for leadership, procurement, funders, partners, boards, regulators or other audiences where credibility and clarity carry weight.',
    cta: {_type:'cta', label:'Strengthen My Corporate Materials', href:'contact.html', style:'primary'},
  },

  'Campaign Creative': {
    shortDescription: 'Create a campaign people can recognize across every channel—not a collection of disconnected graphics.',
    clientProblem: 'Launches and campaigns often lose impact when every asset looks like a separate idea, especially across social, digital, print and promotional formats.',
    valuePromise: 'A cohesive campaign system that keeps the message and visual idea recognizable while adapting to different channels and formats.',
    whatWeBuild: 'We establish the visual direction, campaign language and repeatable asset system needed to support launches, promotions, social campaigns and multi-channel initiatives.',
    businessOutcomes: [
      'More consistent campaign recognition',
      'Faster creation of related campaign assets',
      'Stronger continuity across channels',
      'A visual concept that can extend through the full campaign lifecycle',
    ],
    idealClient: 'Organizations launching a service, initiative, event, promotion or public-facing campaign that needs coordinated creative across multiple formats.',
    cta: {_type:'cta', label:'Build My Campaign System', href:'contact.html', style:'primary'},
  },

  'Information Design': {
    shortDescription: 'Turn dense information into communication people can understand, remember and act on.',
    clientProblem: 'Your reports, presentations or data may be accurate but difficult to absorb because the hierarchy is unclear, the volume is overwhelming or the most important insight is buried.',
    valuePromise: 'Structured visual communication that helps audiences identify what matters faster without oversimplifying the substance.',
    whatWeBuild: 'We organize complex content into executive presentations, pitch decks, infographics and data visualizations that balance accuracy, hierarchy and visual comprehension.',
    businessOutcomes: [
      'Faster comprehension of complex information',
      'Clearer executive and stakeholder presentations',
      'More persuasive visual storytelling',
      'Reusable structures for future reports, decks and data communication',
    ],
    idealClient: 'Organizations communicating research, strategy, performance data, proposals or complex ideas to decision-makers and stakeholder audiences.',
    cta: {_type:'cta', label:'Clarify My Information', href:'contact.html', style:'primary'},
  },
}

let tx = client.transaction().patch('servicesPage', (patch) => patch.set(pageChanges))

for (const service of services) {
  const changes = serviceContent[service.title]
  if (!changes) continue
  tx = tx.patch(service._id, (patch) => patch.set(changes))
}

await tx.commit({visibility:'sync'})

const verifyPage = await client.fetch('*[_id == "servicesPage"][0]{heroHeading,processHeading,experienceHeading,differenceHeading,faqHeading,closingMessage,heroClientValue,processIntro,differenceIntro,faqIntro,closingBody}')
const verifyServices = await client.fetch('*[_type == "service"] | order(displayOrder asc){title,clientProblem,valuePromise,businessOutcomes,idealClient}')

console.log('Services conversion-copy update complete.')
console.log('Page fields changed:', Object.keys(pageChanges).join(', '))
console.log('Service documents updated:', verifyServices.length)
console.log('Preserved headings:', [
  verifyPage.heroHeading,
  verifyPage.processHeading,
  verifyPage.experienceHeading,
  verifyPage.differenceHeading,
  verifyPage.faqHeading,
  verifyPage.closingMessage,
].join(' | '))
console.log('New parity fields populated:', Boolean(verifyPage.processIntro && verifyPage.differenceIntro && verifyPage.faqIntro && verifyPage.closingBody))
