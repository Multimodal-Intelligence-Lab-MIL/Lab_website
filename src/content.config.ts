import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string().optional().default(''),
    date: z.coerce.date(),
    category: z.enum(['Publication', 'Award', 'Event', 'Opportunity', 'General']).default('General'),
    summary: z.string().optional().default(''),
    image: z.string().optional(),
    externalUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
    relatedPublications: z.array(z.string()).optional(),
    dateLabel: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string().optional(),
    year: z.number(),
    category: z.enum(['Journal', 'Conference', 'Workshop', 'Preprint', 'Dataset', 'Other']).default('Other'),
    // Required: the build fails if a paper names a research area that does not exist.
    research: reference('research'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    abstract: z.string().optional(),
    award: z.string().optional(),
    doi: z.string().optional(),
    paperUrl: z.string().optional(),
    pdf: z.string().optional(),
    arxiv: z.string().optional(),
    project: z.string().optional(),
    code: z.string().optional(),
    dataset: z.string().optional(),
    video: z.string().optional(),
    sourceUrl: z.string().optional(),
    bibtex: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    category: z.enum(['Faculty', 'Postdoctoral Researchers', 'PhD Students', 'Research Assistants', 'Visiting Scholars', 'MSc Students', 'Undergraduate Students', 'Alumni']),
    role: z.string().optional(),
    bio: z.string().optional(),
    image: z.string().optional(),
    email: z.string().optional(),
    scholar: z.string().optional(),
    website: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    order: z.number().default(100),
    current: z.boolean().default(true),
    draft: z.boolean().default(false)
  })
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    summary: z.string(),
    accent: z.enum(['cyan', 'violet', 'mint', 'blue']).default('cyan'),
    order: z.number().default(100),
    featured: z.boolean().default(true),
    draft: z.boolean().default(false)
  })
});

export const collections = { news, publications, people, research };
