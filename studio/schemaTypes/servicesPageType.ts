import {defineArrayMember, defineField, defineType} from 'sanity'

export const servicesPageType = defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'process', title: 'Process'},
    {name: 'experience', title: 'Client Experience'},
    {name: 'difference', title: 'The Difference'},
    {name: 'faq', title: 'FAQ'},
    {name: 'conversion', title: 'Conversion'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string', group: 'hero'}),
    defineField({name: 'heroHeading', title: 'Hero Heading', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroClientValue',
      title: 'Hero Client Value Statement',
      type: 'text',
      rows: 4,
      group: 'hero',
      description: 'Explain what the client can engage DV to solve or build.',
    }),

    defineField({name: 'processEyebrow', title: 'Process Eyebrow', type: 'string', group: 'process'}),
    defineField({name: 'processHeading', title: 'Process Heading', type: 'string', group: 'process'}),
    defineField({name: 'processIntro', title: 'Process Supporting Copy', type: 'text', rows: 4, group: 'process'}),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      group: 'process',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'number', title: 'Number', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'What the Client Can Expect', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),

    defineField({name: 'experienceEyebrow', title: 'Section Eyebrow', type: 'string', group: 'experience'}),
    defineField({name: 'experienceHeading', title: 'Section Heading', type: 'string', group: 'experience'}),
    defineField({name: 'experienceCopy', title: 'Client-Facing Supporting Copy', type: 'text', rows: 4, group: 'experience'}),
    defineField({
      name: 'selectedClients',
      title: 'Selected Clients',
      type: 'array',
      group: 'experience',
      of: [defineArrayMember({type: 'reference', to: [{type: 'client'}]})],
    }),

    defineField({name: 'differenceEyebrow', title: 'Section Eyebrow', type: 'string', group: 'difference'}),
    defineField({name: 'differenceHeading', title: 'Section Heading', type: 'string', group: 'difference'}),
    defineField({name: 'differenceIntro', title: 'The Difference Supporting Copy', type: 'text', rows: 4, group: 'difference'}),
    defineField({
      name: 'differenceCards',
      title: 'Difference Cards',
      type: 'array',
      group: 'difference',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'number', title: 'Number', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'clientBenefit', title: 'Client Benefit', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'clientBenefit'}},
        }),
      ],
    }),

    defineField({name: 'faqEyebrow', title: 'FAQ Eyebrow', type: 'string', group: 'faq'}),
    defineField({name: 'faqHeading', title: 'FAQ Heading', type: 'string', group: 'faq'}),
    defineField({name: 'faqIntro', title: 'FAQ Supporting Copy', type: 'text', rows: 4, group: 'faq'}),
    defineField({
      name: 'faq',
      title: 'Questions & Answers',
      type: 'array',
      group: 'faq',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string'}),
            defineField({name: 'answer', title: 'Answer', type: 'text', rows: 4}),
          ],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        }),
      ],
    }),

    defineField({name: 'closingMessage', title: 'Closing Conversion Message', type: 'string', group: 'conversion'}),
    defineField({name: 'closingBody', title: 'Closing Supporting Copy', type: 'text', rows: 4, group: 'conversion'}),
    defineField({name: 'closingCta', title: 'Closing CTA', type: 'cta', group: 'conversion'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {
    prepare: () => ({title: 'Services Page'}),
  },
})
