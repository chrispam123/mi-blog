// content.config.ts
import { defineCollection } from 'astro:content'
import { z } from 'zod'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    showArchitectureDiagram: z.boolean().optional(), // ◄ Añadimos esta línea
  }),
})

export const collections = { posts }
