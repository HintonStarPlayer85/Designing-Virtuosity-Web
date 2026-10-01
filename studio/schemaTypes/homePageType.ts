import {defineArrayMember, defineField, defineType} from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'proof', title: 'Portfolio Highlight'},
    {name: 'capabilities', title: 'Capabilities'},
    {name: 'philosophy', title: 'Design Philosophy'},
    {name: 'about', title: 'About / Evolution'},
    {name: 'conversion', title: 'Conversion'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadlineTop', title: 'Hero Headline — Top Line', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadlineAccent', title: 'Hero Headline — Accent Line', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroClientValue',
      title: 'Hero Client Value Statement',
      type: 'text',
      rows: 4,
      group: 'hero',
      description: 'Buyer-facing copy: what DV builds, who it helps, and why it matters.',
    }),
    defineField({name: 'heroPrimaryCta', title: 'Primary CTA', type: 'cta', group: 'hero'}),
    defineField({name: 'heroSecondaryCta', title: 'Secondary CTA', type: 'cta', group: 'hero'}),

    defineField({name: 'proofEyebrow', title: 'Portfolio Eyebrow', type: 'string', group: 'proof'}),
    defineField({name: 'proofHeading', title: 'Portfolio Heading', type: 'string', group: 'proof'}),
    defineField({
      name: 'proofClientCopy',
      title: 'Portfolio Buyer-Facing Copy',
      type: 'text',
      rows: 4,
      group: 'proof',
      description: 'Explain what the work demonstrates for a prospective client.',
    }),

    defineField({name: 'capabilitiesEyebrow', title: 'Capabilities Eyebrow', type: 'string', group: 'capabilities'}),
    defineField({name: 'capabilitiesHeading', title: 'Capabilities Heading', type: 'string', group: 'capabilities'}),
    defineField({name: 'capabilitiesIntro', title: 'Capabilities Intro', type: 'text', rows: 4, group: 'capabilities'}),
    defineField({
      name: 'capabilityHighlights',
      title: 'Capability Highlights',
      type: 'array',
      group: 'capabilities',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'clientProblem', title: 'Client Problem', type: 'text', rows: 2}),
            defineField({name: 'businessValue', title: 'Business Value', type: 'text', rows: 2}),
            defineField({name: 'href', title: 'Link', type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'businessValue'}},
        }),
      ],
    }),

    defineField({name: 'philosophyEyebrow', title: 'Philosophy Eyebrow', type: 'string', group: 'philosophy'}),
    defineField({name: 'philosophyHeading', title: 'Philosophy Heading', type: 'string', group: 'philosophy'}),
    defineField({name: 'philosophyBody', title: 'Philosophy Body', type: 'text', rows: 4, group: 'philosophy'}),
    defineField({
      name: 'principles',
      title: 'Principles',
      type: 'array',
      group: 'philosophy',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),

    defineField({name: 'aboutEyebrow', title: 'About Eyebrow', type: 'string', group: 'about'}),
    defineField({name: 'aboutHeading', title: 'About Heading', type: 'string', group: 'about'}),
    defineField({name: 'aboutClientCopy', title: 'About / Trust Copy', type: 'text', rows: 5, group: 'about'}),
    defineField({
      name: 'timeline',
      title: 'Evolution Timeline',
      type: 'array',
      group: 'about',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'period', title: 'Period', type: 'string'}),
            defineField({name: 'label', title: 'Capability', type: 'string'}),
          ],
          preview: {select: {title: 'period', subtitle: 'label'}},
        }),
      ],
    }),

    defineField({
      name: 'primaryConversionMessage',
      title: 'Primary Conversion Message',
      type: 'text',
      rows: 4,
      group: 'conversion',
      description: 'What should a qualified prospective client understand before clicking the CTA?',
    }),
    defineField({name: 'closingCta', title: 'Closing CTA', type: 'cta', group: 'conversion'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {
    prepare: () => ({title: 'Home Page'}),
  },
})
