import {defineField, defineType} from 'sanity'

export const contentBlockType = defineType({
  name: 'contentBlock',
  title: 'Content Block',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 5}),
    defineField({name: 'cta', title: 'Call to Action', type: 'cta'}),
  ],
})
