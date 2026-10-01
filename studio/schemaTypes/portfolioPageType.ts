import {defineField, defineType} from 'sanity'

export const portfolioPageType = defineType({
  name: 'portfolioPage',
  title: 'Portfolio Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'featured', title: 'Featured Work'},
    {name: 'index', title: 'Portfolio Index'},
    {name: 'identity', title: 'Identity Archive'},
    {name: 'range', title: 'Design Range'},
    {name: 'conversion', title: 'Conversion'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadingTop', title: 'Hero Heading — Top', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeadingAccent', title: 'Hero Heading — Accent', type: 'string', group: 'hero'}),
    defineField({name: 'heroIntro', title: 'Hero Supporting Copy', type: 'text', rows: 4, group: 'hero'}),

    defineField({name: 'featuredEyebrow', title: 'Featured Work Eyebrow', type: 'string', group: 'featured'}),
    defineField({name: 'featuredHeading', title: 'Featured Work Heading', type: 'string', group: 'featured'}),
    defineField({name: 'featuredIntro', title: 'Featured Work Supporting Copy', type: 'text', rows: 4, group: 'featured'}),

    defineField({name: 'indexEyebrow', title: 'Portfolio Index Eyebrow', type: 'string', group: 'index'}),
    defineField({name: 'indexHeading', title: 'Portfolio Index Heading', type: 'string', group: 'index'}),
    defineField({name: 'indexIntro', title: 'Portfolio Index Supporting Copy', type: 'text', rows: 4, group: 'index'}),

    defineField({name: 'identityEyebrow', title: 'Identity Archive Eyebrow', type: 'string', group: 'identity'}),
    defineField({name: 'identityHeading', title: 'Identity Archive Heading', type: 'string', group: 'identity'}),
    defineField({name: 'identityIntro', title: 'Identity Archive Supporting Copy', type: 'text', rows: 4, group: 'identity'}),

    defineField({name: 'rangeEyebrow', title: 'Design Range Eyebrow', type: 'string', group: 'range'}),
    defineField({name: 'rangeHeading', title: 'Design Range Heading', type: 'string', group: 'range'}),
    defineField({name: 'rangeIntro', title: 'Design Range Supporting Copy', type: 'text', rows: 4, group: 'range'}),

    defineField({name: 'closingHeading', title: 'Closing CTA Heading', type: 'string', group: 'conversion'}),
    defineField({name: 'closingBody', title: 'Closing CTA Supporting Copy', type: 'text', rows: 4, group: 'conversion'}),
    defineField({name: 'closingCta', title: 'Closing CTA', type: 'cta', group: 'conversion'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Portfolio Page'})},
})
