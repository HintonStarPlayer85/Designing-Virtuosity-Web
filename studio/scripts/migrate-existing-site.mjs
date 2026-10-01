import {createClient} from '@sanity/client'
import {load} from 'cheerio'
import {readFileSync} from 'node:fs'
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

const html = (name) => readFileSync(resolve(repoRoot, name), 'utf8')
const pages = {
  home: load(html('index.html')),
  services: load(html('services.html')),
  portfolio: load(html('portfolio.html')),
  contact: load(html('contact.html')),
}
const contactJs = readFileSync(resolve(repoRoot, 'js/contact.js'), 'utf8')

const clean = (value='') => String(value).replace(/\s+/g, ' ').trim()
const directText = ($, selector) => clean($(selector).first().clone().children().remove().end().text())
const slugify = (value='') => clean(value).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const keyify = (value='') => slugify(value).slice(0, 80) || 'item'
const ctaFrom = ($, el, style='primary') => {
  const node = $(el).first()
  if (!node.length) return undefined
  return {_type:'cta', _key:keyify(clean(node.text())), label:clean(node.text().replace('→','')), href:node.attr('href') || '', style}
}
const seoFrom = ($) => ({
  _type:'seoFields',
  metaTitle: clean($('title').text()),
  metaDescription: clean($('meta[name="description"]').attr('content')),
  noIndex: /noindex/i.test($('meta[name="robots"]').attr('content') || ''),
})
const sectionByKicker = ($, label) => $('section').filter((_, el) => clean($(el).find('.kicker').first().text()) === label).first()
const uniqueStrings = (items) => [...new Set(items.map(clean).filter(Boolean))]
const levelValue = (label='') => {
  const v=clean(label).toLowerCase()
  if (v.includes('case study')) return 'caseStudy'
  if (v.includes('featured')) return 'featured'
  return 'artifact'
}

function siteSettingsDoc() {
  const $=pages.home
  const nav = $('.nav-links a').map((i,el)=>({
    _key:`nav-${i+1}`,
    label:clean($(el).text()),
    href:$(el).attr('href') || '',
    isPrimary:$(el).hasClass('nav-cta'),
  })).get()
  const footerColumns=$('.footer-column').map((i,col)=>({
    _key:`footer-column-${i+1}`,
    heading:clean($(col).find('h3').first().text()),
    links:$(col).find('a').not('.footer-social-link').map((j,a)=>({
      _key:`footer-link-${i+1}-${j+1}`,
      label:clean($(a).text()),
      href:$(a).attr('href') || '',
    })).get(),
  })).get().filter(x=>x.links.length)
  const socials=$('.footer-social-link').map((i,a)=>({
    _key:`social-${i+1}`,
    label:$(a).attr('title') || $(a).attr('aria-label') || clean($(a).text()),
    platform:$(a).hasClass('footer-social-instagram')?'Instagram':($(a).attr('href')||'').startsWith('mailto:')?'Email':'Link',
    url:$(a).attr('href') || '',
  })).get()
  return {
    _id:'siteSettings', _type:'siteSettings',
    siteTitle:clean($('.brand strong').first().text()) || 'Designing Virtuosity',
    legalName:'Designing Virtuosity Digital Media',
    tagline:clean($('.hero .kicker').first().text()),
    commercialPositioning:clean($('.hero-topline p').last().text()),
    foundedYear:2009,
    primaryDomain:'https://designingvirtuosity.com',
    email:'hello@designingvirtuosity.com',
    instagramHandle:'@DesigningVirtuosity',
    instagramUrl:'https://www.instagram.com/designingvirtuosity/',
    navigation:nav,
    footerMeta:clean($('.footer-meta').first().text()),
    footerStatement:clean($('.footer-statement').first().text()),
    footerProjectEyebrow:clean($('.footer-project-card .eyebrow').first().text()),
    footerProjectHeading:clean($('.footer-project-card strong').first().text()),
    footerProjectAction:clean($('.footer-project-action').first().text().replace('→','')),
    footerProjectHref:$('.footer-project-card').first().attr('href') || '',
    footerColumns,
    socialLinks:socials,
    defaultSeo:seoFrom($),
  }
}

function homeDoc(){
  const $=pages.home
  const proof=sectionByKicker($,'Selected Work')
  const capabilities=sectionByKicker($,'What We Design')
  const philosophy=sectionByKicker($,'Our Approach')
  const established=sectionByKicker($,'Established 2009')
  const heroSpans=$('.hero h1.display span')
  return {
    _id:'homePage', _type:'homePage',
    heroEyebrow:clean($('.hero .kicker').first().text()),
    heroSupportingCopy:clean($('.hero-topline p').last().text()),
    heroHeadlineTop:clean(heroSpans.eq(0).text()),
    heroHeadlineAccent:clean(heroSpans.eq(1).text()),
    heroPrimaryCta:ctaFrom($,$('.hero-actions a').eq(0),'primary'),
    heroSecondaryCta:ctaFrom($,$('.hero-actions a').eq(1),'secondary'),
    heroStatNumber:clean($('.hero-stat strong').text()),
    heroStatLabel:clean($('.hero-stat').clone().children().remove().end().text()),
    marqueeTerms:uniqueStrings($('.marquee-track span').map((_,el)=>$(el).text()).get()),
    proofEyebrow:clean(proof.find('.kicker').first().text()),
    proofHeading:clean(proof.find('.section-title').first().text()),
    proofClientCopy:clean(proof.find('.lede').first().text()),
    proofCards:proof.find('.work-card').map((i,card)=>({
      _key:`proof-${i+1}`,
      title:clean($(card).find('h3').first().text()),
      description:clean($(card).find('p').last().text()),
      href:$(card).attr('href') || '',
      tags:$(card).find('.pill').map((_,tag)=>clean($(tag).text())).get(),
    })).get(),
    capabilitiesEyebrow:clean(capabilities.find('.kicker').first().text()),
    capabilitiesHeading:clean(capabilities.find('.section-title').first().text()),
    capabilitiesIntro:clean(capabilities.find('.lede').first().text()),
    capabilityHighlights:capabilities.find('.capability').map((i,item)=>({
      _key:`capability-${i+1}`,
      number:clean($(item).find('.num').text()),
      title:clean($(item).find('h3').text()),
      description:clean($(item).find('p').text()),
      href:$(item).attr('href') || '',
    })).get(),
    philosophyEyebrow:clean(philosophy.find('.kicker').first().text()),
    philosophyHeading:clean(philosophy.find('.section-title').first().text()),
    philosophyParagraphs:philosophy.find('.philosophy-copy p').map((_,p)=>clean($(p).text())).get(),
    principles:philosophy.find('.principle').map((i,item)=>({
      _key:`principle-${i+1}`,
      number:clean($(item).find('.principle-number').text()),
      title:clean($(item).find('h3').text()),
      description:clean($(item).find('p').text()),
    })).get(),
    continuum:philosophy.find('.continuum-node').map((_,n)=>clean($(n).text())).get(),
    aboutEyebrow:clean(established.find('.kicker').first().text()),
    aboutHeading:clean(established.find('.section-title').first().text()),
    aboutParagraphs:established.find('.established-copy > p').not('.kicker').map((_,p)=>clean($(p).text())).get(),
    timeline:established.find('.evolution-step').map((i,item)=>({
      _key:`evolution-${i+1}`,
      period:clean($(item).find('strong').text()),
      label:clean($(item).find('span').text()),
    })).get(),
    closingHeading:clean($('.cta-band h2').first().text()),
    closingBody:clean($('.cta-band p').first().text()),
    closingCta:ctaFrom($,$('.cta-band a.btn').first(),'primary'),
    seo:seoFrom($),
  }
}

function extractClients(){
  const $=pages.services
  const seen=new Map()
  $('.clients-experience .client-track').first().children('.client-chip').each((i,chip)=>{
    const img=$(chip).find('img').first()
    const name=clean(img.attr('alt') || $(chip).find('.client-name').text())
    if(!name || seen.has(name.toLowerCase())) return
    seen.set(name.toLowerCase(),{
      _id:`client-${slugify(name)}`,
      _type:'client',
      name,
      slug:{_type:'slug',current:slugify(name)},
      legacyLogoPath:img.attr('src') || undefined,
      featured:true,
      displayOrder:seen.size+1,
    })
  })
  return [...seen.values()]
}

function serviceDocs(){
  const $=pages.services
  return $('.service-panel').map((i,panel)=>{
    const title=clean($(panel).find('.service-button h2').text())
    return {
      _id:`service-${slugify(title)}`, _type:'service',
      title,
      slug:{_type:'slug',current:slugify(title)},
      shortDescription:clean($(panel).find('.service-content-inner p').first().text()),
      whatWeBuild:clean($(panel).find('.service-content-inner p').first().text()),
      deliverables:$(panel).find('.service-list li').map((_,li)=>clean($(li).text())).get(),
      featured:true,
      displayOrder:i+1,
    }
  }).get()
}

function servicesPageDoc(clients){
  const $=pages.services
  const hero=$('.page-hero').first()
  const process=sectionByKicker($,'Our Process')
  const clientSection=$('.clients-experience').first()
  const difference=$('.dv-difference').first()
  const faq=$('.dv-faq').first()
  return {
    _id:'servicesPage', _type:'servicesPage',
    heroEyebrow:clean(hero.find('.kicker').text()),
    heroHeading:clean(hero.find('h1').text()),
    heroClientValue:clean(hero.find('.lede').text()),
    processEyebrow:clean(process.find('.kicker').first().text()),
    processHeading:clean(process.find('.section-title').first().text()),
    processSteps:process.find('.process-card').map((i,item)=>({
      _key:`process-${i+1}`,
      number:clean($(item).find('span').first().text()),
      title:clean($(item).find('h3').text()),
      description:clean($(item).find('p').text()),
    })).get(),
    experienceEyebrow:clean(clientSection.find('.kicker').first().text()),
    experienceHeading:clean(clientSection.find('.section-title').first().text()),
    experienceCopy:clean(clientSection.find('.lede').first().text()),
    selectedClients:clients.map((c,i)=>({_key:`client-ref-${i+1}`,_type:'reference',_ref:c._id})),
    differenceEyebrow:clean(difference.find('.kicker').first().text()),
    differenceHeading:clean(difference.find('.section-title').first().text()),
    differenceCards:difference.find('.difference-card').map((i,item)=>({
      _key:`difference-${i+1}`,
      number:clean($(item).find('.difference-number').text()),
      title:clean($(item).find('h3').text()),
      clientBenefit:clean($(item).find('p').text()),
    })).get(),
    faqEyebrow:clean(faq.find('.kicker').first().text()),
    faqHeading:clean(faq.find('.section-title').first().text()),
    faq:faq.find('.faq-item').map((i,item)=>({
      _key:`faq-${i+1}`,
      question:clean($(item).find('.faq-question strong').text()),
      answer:clean($(item).find('.faq-answer p').text()),
    })).get(),
    closingMessage:clean($('.cta-band h2').first().text()),
    closingCta:ctaFrom($,$('.cta-band a.btn').first(),'primary'),
    seo:seoFrom($),
  }
}

function portfolioPageDoc(){
  const $=pages.portfolio
  const hero=$('.page-hero').first()
  const featured=$('.wow-featured').first()
  const index=sectionByKicker($,'Portfolio Index')
  const identity=$('.identity-archive').first()
  const range=sectionByKicker($,'Design Range')
  const headingParts=hero.find('h1').first()
  return {
    _id:'portfolioPage', _type:'portfolioPage',
    heroEyebrow:clean(hero.find('.kicker').first().text()),
    heroHeadingTop:directText($,headingParts),
    heroHeadingAccent:clean(headingParts.find('.gradient-word').text()),
    heroIntro:clean(hero.find('.lede').first().text()),
    featuredEyebrow:clean(featured.find('.kicker').first().text()),
    featuredHeading:clean(featured.find('.section-title').first().text()),
    featuredIntro:clean(featured.find('.lede').first().text()),
    indexEyebrow:clean(index.find('.kicker').first().text()),
    indexHeading:clean(index.find('.section-title').first().text()),
    indexIntro:clean(index.find('.lede').first().text()),
    identityEyebrow:clean(identity.find('.kicker').first().text()),
    identityHeading:clean(identity.find('.section-title').first().text()),
    identityIntro:clean(identity.find('.lede').first().text()),
    rangeEyebrow:clean(range.find('.kicker').first().text()),
    rangeHeading:clean(range.find('.section-title').first().text()),
    rangeIntro:clean(range.find('.lede').first().text()),
    closingHeading:clean($('.cta-band h2').first().text()),
    closingCta:ctaFrom($,$('.cta-band a.btn').first(),'primary'),
    seo:seoFrom($),
  }
}

function portfolioProjectDocs(){
  const $=pages.portfolio
  const map=new Map()
  let featuredOrder=0
  let portfolioOrder=0

  $('.feature-project[data-case-title]').each((_,node)=>{
    featuredOrder++
    const el=$(node)
    const title=clean(el.attr('data-case-title'))
    const id=`portfolio-${slugify(title)}`
    map.set(title.toLowerCase(),{
      _id:id,_type:'portfolioProject',
      title,slug:{_type:'slug',current:slugify(title)},
      discipline:clean(el.attr('data-case-discipline')),
      cardCategoryLabel:clean(el.find('.feature-copy .kicker').text()),
      cardCopy:clean(el.find('.feature-copy p').text()),
      portfolioLevel:levelValue(el.attr('data-case-level')),
      summary:clean(el.attr('data-case-summary')),
      portfolioTreatment:clean(el.attr('data-case-treatment')),
      deliverables:clean(el.attr('data-case-deliverables'))?[clean(el.attr('data-case-deliverables'))]:[],
      website:el.attr('data-case-url') || undefined,
      legacyAccent:el.attr('data-case-accent') || undefined,
      featured:true,
      featuredOrder,
    })
  })

  $('.work-item[data-case-title]').each((_,node)=>{
    portfolioOrder++
    const el=$(node)
    const title=clean(el.attr('data-case-title'))
    const key=title.toLowerCase()
    const existing=map.get(key) || {
      _id:`portfolio-${slugify(title)}`,_type:'portfolioProject',
      title,slug:{_type:'slug',current:slugify(title)},
      featured:false,
    }
    existing.discipline=existing.discipline || clean(el.attr('data-case-discipline'))
    existing.cardCategoryLabel=existing.cardCategoryLabel || clean(el.find('.work-item-copy > span').first().text())
    existing.cardCopy=existing.cardCopy || clean(el.find('.work-item-copy p').text())
    existing.portfolioLevel=existing.portfolioLevel || levelValue(el.attr('data-case-level'))
    existing.summary=existing.summary || clean(el.attr('data-case-summary'))
    existing.portfolioTreatment=existing.portfolioTreatment || clean(el.attr('data-case-treatment'))
    existing.deliverables=existing.deliverables?.length?existing.deliverables:(clean(el.attr('data-case-deliverables'))?[clean(el.attr('data-case-deliverables'))]:[])
    existing.website=existing.website || el.attr('data-case-url') || undefined
    existing.legacyAccent=existing.legacyAccent || el.attr('data-case-accent') || undefined
    existing.portfolioOrder=portfolioOrder
    map.set(key,existing)
  })
  return [...map.values()]
}

function identityDocs(projects){
  const $=pages.portfolio
  const byTitle=new Map(projects.map(p=>[p.title.toLowerCase(),p]))
  return $('.identity-tile[data-case-title]').map((i,node)=>{
    const el=$(node)
    const title=clean(el.attr('data-case-title'))
    const mark=el.find('.identity-mark').first()
    const classes=(mark.attr('class')||'').split(/\s+/)
    const logoClass=classes.find(c=>c.startsWith('logo-')) || ''
    const project=byTitle.get(title.toLowerCase())
    return {
      _id:`identity-${slugify(title)}`,_type:'identityMark',
      organizationName:title,
      slug:{_type:'slug',current:slugify(title)},
      projectType:clean(el.find('.identity-caption > span').text()) || 'Brand Identity',
      description:clean(el.attr('data-case-summary')),
      portfolioTreatment:clean(el.attr('data-case-treatment')),
      relatedProject:project?{_type:'reference',_ref:project._id}:undefined,
      legacyLogoClass:logoClass,
      legacyAssetPath:logoClass==='logo-supported'?'assets/identity-archive/supported-counsel.webp':'assets/identity-archive/identity-logo-sprite.webp',
      cardBackground:'auto',
      displayScale:logoClass==='logo-supported'?62:72,
      displayOrder:i+1,
      featured:true,
    }
  }).get()
}

function contactDoc(){
  const $=pages.contact
  const hero=$('.page-hero').first()
  const aside=$('.contact-aside').first()
  const meta=aside.find('.contact-meta > div')
  const strategic=$('.strategic-intelligence').first()
  const success=contactJs.match(/setStatus\('([^']+)'\s*,\s*'success'\)/)?.[1] || ''
  const error=contactJs.match(/setStatus\('([^']+)'\s*,\s*'error'\)/)?.[1] || ''
  const fields=$('#project-form').find('input, textarea, select').filter((_,el)=>$(el).attr('name')!=='_honey').map((i,el)=>{
    const node=$(el)
    const id=node.attr('id')
    const label=id?clean($(`label[for="${id}"]`).text()):''
    if(!label) return null
    return {
      _key:`field-${i+1}`,
      label,
      name:node.attr('name') || '',
      inputType:node.is('textarea')?'textarea':node.is('select')?'select':(node.attr('type')||'text'),
      placeholder:node.attr('placeholder') || '',
      required:node.is('[required]'),
    }
  }).get().filter(Boolean)
  return {
    _id:'contactPage',_type:'contactPage',
    heroEyebrow:clean(hero.find('.kicker').first().text()),
    heroHeadingTop:directText($,hero.find('h1').first()),
    heroHeadingAccent:clean(hero.find('.gradient-word').text()),
    heroIntro:clean(hero.find('.lede').first().text()),
    inquiryEyebrow:clean(aside.find('.kicker').first().text()),
    inquiryHeading:clean(aside.find('.section-title').first().text()),
    inquiryCopy:clean(aside.find('> p').last().text()),
    studioLabel:clean(meta.eq(0).clone().children().remove().end().text()) || clean(meta.eq(0).text().replace(clean(meta.eq(0).find('span').text()),'')),
    establishedLabel:clean(meta.eq(1).clone().children().remove().end().text()) || clean(meta.eq(1).text().replace(clean(meta.eq(1).find('span').text()),'')),
    projectTypesSummary:clean(meta.eq(2).clone().children().remove().end().text()) || clean(meta.eq(2).text().replace(clean(meta.eq(2).find('span').text()),'')),
    projectTypes:$('#project-form input[name="project_type"]').map((_,el)=>clean($(`label[for="${$(el).attr('id')}"]`).text())).get(),
    budgetOptions:$('#budget option').map((_,el)=>clean($(el).text())).get().filter(v=>v && !/^select/i.test(v)),
    timelineOptions:$('#timeline option').map((_,el)=>clean($(el).text())).get().filter(v=>v && !/^select/i.test(v)),
    sourceOptions:$('datalist option').map((_,el)=>clean($(el).attr('value') || $(el).text())).get().filter(Boolean),
    formFields:fields,
    submitLabel:clean($('#project-form button[type="submit"]').text().replace('→','')),
    formNote:clean($('#project-form .form-note').text()),
    successMessage:success,
    errorMessage:error,
    referralEyebrow:clean(strategic.find('.kicker').first().text()),
    referralHeading:clean(strategic.find('h2').first().text()),
    referralCopy:clean(strategic.find('p').last().text()),
    referralLabel:clean(strategic.find('.intelligence-link strong').text()),
    referralUrl:strategic.find('.intelligence-link').attr('href') || '',
    seo:seoFrom($),
  }
}

const clients=extractClients()
const services=serviceDocs()
const projects=portfolioProjectDocs()
const identities=identityDocs(projects)
const documents=[
  siteSettingsDoc(),
  homeDoc(),
  servicesPageDoc(clients),
  portfolioPageDoc(),
  contactDoc(),
  ...clients,
  ...services,
  ...projects,
  ...identities,
].map((doc)=>Object.fromEntries(Object.entries(doc).filter(([,v])=>v!==undefined && v!=='' && !(Array.isArray(v)&&v.length===0))))

console.log(`Preparing ${documents.length} documents for ${projectId}/${dataset}`)
const groups=[]
for(let i=0;i<documents.length;i+=20) groups.push(documents.slice(i,i+20))

for(const [index,group] of groups.entries()){
  let tx=client.transaction()
  for(const doc of group) tx=tx.createOrReplace(doc)
  await tx.commit({visibility:'sync'})
  console.log(`Committed batch ${index+1}/${groups.length}: ${group.length} documents`)
}

const counts=documents.reduce((acc,d)=>{acc[d._type]=(acc[d._type]||0)+1;return acc},{})
console.log('Migration complete:', JSON.stringify(counts,null,2))
