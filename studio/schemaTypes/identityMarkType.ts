import {defineField, defineType} from 'sanity'

export const identityMarkType = defineType({
  name: 'identityMark',
  title: 'Identity Archive Mark',
  type: 'document',
  fields: [
    defineField({
      name: 'organizationName',
      title: 'Organization Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'organizationName', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'client', title: 'Linked Client', type: 'reference', to: [{type: 'client'}]}),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type Label',
      type: 'string',
      options: {
        list: [
          'Expanded Brand Project',
          'Brand Identity',
          'Portfolio Artifact',
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Optional Client-Facing Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related Portfolio Project',
      type: 'reference',
      to: [{type: 'portfolioProject'}],
    }),
    defineField({
      name: 'cardBackground',
      title: 'Logo Card Background',
      type: 'string',
      options: {
        list: [
          {title: 'Automatic', value: 'auto'},
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
          {title: 'Transparent', value: 'transparent'},
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'displayScale',
      title: 'Logo Display Scale (%)',
      type: 'number',
      description: 'Fine-tune how large the mark appears inside its existing portfolio card.',
      initialValue: 72,
      validation: (Rule) => Rule.min(30).max(100),
    }),
    defineField({name: 'displayOrder', title: 'Display Order', type: 'number'}),
    defineField({name: 'featured', title: 'Show in Identity Archive', type: 'boolean', initialValue: true}),
  ],
  orderings: [
    {title: 'Display Order', name: 'displayOrder', by: [{field: 'displayOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'organizationName', subtitle: 'projectType', media: 'logo'},
  },
})
