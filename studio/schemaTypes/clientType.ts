import {defineField, defineType} from 'sanity'

export const clientType = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Organization Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name', maxLength: 96}, validation: (Rule) => Rule.required()}),
    defineField({name: 'sector', title: 'Sector / Industry', type: 'string'}),
    defineField({name: 'website', title: 'Website', type: 'url'}),
    defineField({name: 'logo', title: 'Logo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'legacyLogoPath', title: 'Current Site Logo Path', type: 'string', readOnly: true}),
    defineField({name: 'featured', title: 'Show in Selected Client Experience', type: 'boolean', initialValue: false}),
    defineField({name: 'displayOrder', title: 'Display Order', type: 'number'}),
  ],
  orderings: [{title: 'Display Order', name: 'displayOrder', by: [{field: 'displayOrder', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'sector', media: 'logo'}},
})
