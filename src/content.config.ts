// content.config.ts
// Configuración de Content Collections para Astro 5.
// El loader glob() le dice a Astro que busque todos los archivos
// Markdown dentro de la carpeta src/content/posts/
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
  }),
})

export const collections = { posts }
