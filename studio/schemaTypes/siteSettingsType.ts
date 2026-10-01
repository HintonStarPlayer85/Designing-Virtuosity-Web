import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Designing Virtuosity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'legalName', title: 'Legal / Business Name', type: 'string'}),
    defineField({
      name: 'tagline',
      title: 'Brand Tagline',
      type: 'string',
      description: 'Brand voice, not the full sales proposition.',
    }),
    defineField({
      name: 'commercialPositioning',
      title: 'Commercial Positioning Statement',
      type: 'text',
      rows: 3,
      description: 'Plain-language explanation of what DV does, for whom, and the business value.',
    }),
    defineField({name: 'foundedYear', title: 'Founded Year', type: 'number', initialValue: 2009}),
    defineField({name: 'primaryDomain', title: 'Primary Domain', type: 'url'}),
    defineField({name: 'email', title: 'Primary Email', type: 'string'}),
    defineField({name: 'instagramHandle', title: 'Instagram Handle', type: 'string'}),
    defineField({name: 'instagramUrl', title: 'Instagram URL', type: 'url'}),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'href', title: 'Link', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'isPrimary', title: 'Primary Button', type: 'boolean', initialValue: false}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'href'},
          },
        }),
      ],
    }),
    defineField({name: 'footerHeading', title: 'Footer Heading', type: 'string'}),
    defineField({name: 'footerStatement', title: 'Footer Statement', type: 'text', rows: 3}),
    defineField({
      name: 'socialLinks',
      title: 'Social / Contact Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'platform', title: 'Platform', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        }),
      ],
    }),
    defineField({name: 'defaultSeo', title: 'Default SEO', type: 'seoFields'}),
  ],
  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})
