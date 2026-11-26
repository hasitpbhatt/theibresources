import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Every entry must declare where it came from. Only `original` content is
 * allowed to ship; see scripts/check-provenance.mjs.
 */
const provenance = z.object({
  origin: z.enum(['original', 'public-domain', 'licensed']),
  author: z.string().min(1),
  url: z.url().optional(),
  licence: z.string().optional(),
  retrieved: z.coerce.date().optional(),
});

const units = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/units' }),
  schema: z.object({
    title: z.string().min(3).max(70),
    subject: z.enum(['ess', 'biology']),
    code: z.string().regex(/^[a-z0-9-]+$/, 'code becomes the URL segment'),
    summary: z.string().min(20).max(220),
    order: z.number().int().min(1),
    level: z.enum(['sl-hl', 'hl-only']).default('sl-hl'),
    status: z.enum(['published', 'coming-soon']),
    outline: z.array(z.string()).default([]),
    provenance,
  }),
});

export const collections = { units };
