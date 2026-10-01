import {defineArrayMember, defineField, defineType} from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  groups: [
    {name: 'positioning', title: 'Positioning'},
    {name: 'offer', title: 'Offer'},
    {name: 'proof', title: 'Proof / Relationships'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Service Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'shortDescription', title: 'Short Description', type: 'text', rows: 3, group: 'positioning'}),
    defineField({
      name: 'clientProblem',
      title: 'Client Problem',
      type: 'text',
      rows: 4,
      group: 'positioning',
      description: 'What situation, friction, or risk causes a buyer to need this service?',
    }),
    defineField({
      name: 'valuePromise',
      title: 'Value Promise',
      type: 'text',
      rows: 4,
      group: 'positioning',
      description: 'What changes for the client after DV completes the work?',
    }),
    defineField({name: 'whatWeBuild', title: 'What We Build', type: 'text', rows: 5, group: 'offer'}),
    defineField({
      name: 'deliverables',
      title: 'Typical Deliverables',
      type: 'array',
      group: 'offer',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'businessOutcomes',
      title: 'Business Outcomes',
      type: 'array',
      group: 'offer',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'idealClient', title: 'Ideal Client', type: 'text', rows: 4, group: 'offer'}),
    defineField({
      name: 'relatedProjects',
      title: 'Related Portfolio Projects',
      type: 'array',
      group: 'proof',
      of: [defineArrayMember({type: 'reference', to: [{type: 'portfolioProject'}]})],
    }),
    defineField({name: 'cta', title: 'Service CTA', type: 'cta', group: 'offer'}),
    defineField({name: 'featured', title: 'Feature This Service', type: 'boolean', initialValue: true}),
    defineField({name: 'displayOrder', title: 'Display Order', type: 'number'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  orderings: [
    {title: 'Display Order', name: 'displayOrder', by: [{field: 'displayOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'valuePromise'},
  },
})
