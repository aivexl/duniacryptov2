import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const articleType = defineType({
  name: 'article',
  title: 'Dunia Crypto Article',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      description: 'Short description of the article',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'content',
      type: 'text',
      title: 'Content',
      description: 'Full article content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Featured Image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          {title: 'Newsroom', value: 'newsroom'},
          {title: 'Academy', value: 'academy'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'source',
      type: 'string',
      title: 'Source',
      description: 'Source of the article (e.g., "Dunia Crypto", "External")',
      initialValue: 'Dunia Crypto',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured Article',
      description: 'Show this article on the home page',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'image',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const {category, publishedAt} = selection
      return {
        ...selection,
        subtitle: `${category} • ${publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Publication Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Publication Date, Old',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
}) 