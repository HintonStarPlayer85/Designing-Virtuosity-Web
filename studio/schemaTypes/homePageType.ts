import {defineArrayMember, defineField, defineType} from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'proof', title: 'Selected Work'},
    {name: 'capabilities', title: 'Capabilities'},
    {name: 'philosophy', title: 'Design Philosophy'},
    {name: 'about', title: 'About / Evolution'},
    {name: 'conversion', title: 'Conversion'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string', group: 'hero'}),
    defineField({name: 'heroSupportingCopy', title: 'Hero Supporting Copy', type: 'text', rows: 4, group: 'hero'}),
    defineField({name: 'heroHeadlineTop', title: 'Hero Headline — Top Line', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadlineAccent', title: 'Hero Headline — Accent Line', type: 'string', group: 'hero'}),
    defineField({name: 'heroPrimaryCta', title: 'Primary CTA', type: 'cta', group: 'hero'}),
    defineField({name: 'heroSecondaryCta', title: 'Secondary CTA', type: 'cta', group: 'hero'}),
    defineField({name: 'heroStatNumber', title: 'Hero Stat Number', type: 'string', group: 'hero'}),
    defineField({name: 'heroStatLabel', title: 'Hero Stat Label', type: 'string', group: 'hero'}),
    defineField({name: 'marqueeTerms', title: 'Marquee Terms', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'hero'}),

    defineField({name: 'proofEyebrow', title: 'Selected Work Eyebrow', type: 'string', group: 'proof'}),
    defineField({name: 'proofHeading', title: 'Selected Work Heading', type: 'string', group: 'proof'}),
    defineField({name: 'proofClientCopy', title: 'Selected Work Supporting Copy', type: 'text', rows: 4, group: 'proof'}),
    defineField({
      name: 'proofCards',
      title: 'Selected Work Cards',
      type: 'array',
      group: 'proof',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({name: 'title', title: 'Title', type: 'string'}),
          defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          defineField({name: 'href', title: 'Link', type: 'string'}),
          defineField({name: 'tags', title: 'Tags', type: 'array', of: [defineArrayMember({type: 'string'})]}),
        ],
        preview: {select: {title: 'title', subtitle: 'description'}},
      })],
    }),

    defineField({name: 'capabilitiesEyebrow', title: 'Capabilities Eyebrow', type: 'string', group: 'capabilities'}),
    defineField({name: 'capabilitiesHeading', title: 'Capabilities Heading', type: 'string', group: 'capabilities'}),
    defineField({name: 'capabilitiesIntro', title: 'Capabilities Intro', type: 'text', rows: 4, group: 'capabilities'}),
    defineField({
      name: 'capabilityHighlights',
      title: 'Capability Highlights',
      type: 'array',
      group: 'capabilities',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({name: 'number', title: 'Number', type: 'string'}),
          defineField({name: 'title', title: 'Title', type: 'string'}),
          defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          defineField({name: 'href', title: 'Link', type: 'string'}),
        ],
        preview: {select: {title: 'title', subtitle: 'description'}},
      })],
    }),

    defineField({name: 'philosophyEyebrow', title: 'Philosophy Eyebrow', type: 'string', group: 'philosophy'}),
    defineField({name: 'philosophyHeading', title: 'Philosophy Heading', type: 'string', group: 'philosophy'}),
    defineField({name: 'philosophyParagraphs', title: 'Philosophy Paragraphs', type: 'array', of: [defineArrayMember({type: 'text', rows: 3})], group: 'philosophy'}),
    defineField({
      name: 'principles',
      title: 'Principles',
      type: 'array',
      group: 'philosophy',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({name: 'number', title: 'Number', type: 'string'}),
          defineField({name: 'title', title: 'Title', type: 'string'}),
          defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        ],
        preview: {select: {title: 'title', subtitle: 'description'}},
      })],
    }),
    defineField({name: 'continuum', title: 'Identity-to-Growth Continuum', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'philosophy'}),

    defineField({name: 'aboutEyebrow', title: 'About Eyebrow', type: 'string', group: 'about'}),
    defineField({name: 'aboutHeading', title: 'About Heading', type: 'string', group: 'about'}),
    defineField({name: 'aboutParagraphs', title: 'About Paragraphs', type: 'array', of: [defineArrayMember({type: 'text', rows: 3})], group: 'about'}),
    defineField({
      name: 'timeline',
      title: 'Evolution Timeline',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({name: 'period', title: 'Period', type: 'string'}),
          defineField({name: 'label', title: 'Capability', type: 'string'}),
        ],
        preview: {select: {title: 'period', subtitle: 'label'}},
      })],
    }),

    defineField({name: 'closingHeading', title: 'Closing CTA Heading', type: 'string', group: 'conversion'}),
    defineField({name: 'closingBody', title: 'Closing CTA Supporting Copy', type: 'text', rows: 3, group: 'conversion'}),
    defineField({name: 'closingCta', title: 'Closing CTA', type: 'cta', group: 'conversion'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Home Page'})},
})
