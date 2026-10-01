import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({name: 'siteTitle', title: 'Site Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'legalName', title: 'Legal / Business Name', type: 'string'}),
    defineField({name: 'tagline', title: 'Brand Tagline', type: 'string'}),
    defineField({name: 'headerMeta', title: 'Header Meta Line', type: 'string', description: 'Small line beneath the brand name in the site header. Falls back to Footer Meta Line when blank.'}),
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
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'string'}),
          defineField({name: 'href', title: 'Link', type: 'string'}),
          defineField({name: 'isPrimary', title: 'Primary Button', type: 'boolean', initialValue: false}),
        ],
        preview: {select: {title: 'label', subtitle: 'href'}},
      })],
    }),
    defineField({name: 'footerMeta', title: 'Footer Meta Line', type: 'string'}),
    defineField({name: 'locationLabel', title: 'Footer Location', type: 'string', description: 'Location displayed beside the established year in the footer.'}),
    defineField({name: 'footerStatement', title: 'Footer Statement', type: 'text', rows: 3}),
    defineField({name: 'footerProjectEyebrow', title: 'Footer Project Eyebrow', type: 'string'}),
    defineField({name: 'footerProjectHeading', title: 'Footer Project Heading', type: 'string'}),
    defineField({name: 'footerProjectAction', title: 'Footer Project Action', type: 'string'}),
    defineField({name: 'footerProjectHref', title: 'Footer Project Link', type: 'string'}),
    defineField({
      name: 'footerColumns',
      title: 'Footer Navigation Columns',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({name: 'heading', title: 'Heading', type: 'string'}),
          defineField({
            name: 'links',
            title: 'Links',
            type: 'array',
            of: [defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({name: 'href', title: 'Link', type: 'string'}),
              ],
              preview: {select: {title: 'label', subtitle: 'href'}},
            })],
          }),
        ],
        preview: {select: {title: 'heading'}},
      })],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social / Contact Links',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'string'}),
          defineField({name: 'platform', title: 'Platform', type: 'string'}),
          defineField({name: 'url', title: 'URL', type: 'string'}),
        ],
        preview: {select: {title: 'label', subtitle: 'url'}},
      })],
    }),
    defineField({name: 'defaultSeo', title: 'Default SEO', type: 'seoFields'}),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})
