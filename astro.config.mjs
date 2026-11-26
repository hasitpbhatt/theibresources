// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Single source of truth for the public origin: canonical URLs, Open Graph
  // tags, robots.txt and the sitemap all derive from this. Change it here (or
  // set the SITE_URL env var in the build environment) to move to a custom
  // domain — no other file needs editing.
  site: process.env.SITE_URL ?? 'https://theibresources-by4.pages.dev',
  output: 'static',
  integrations: [mdx(), sitemap()],
  build: {
    assets: '_astro',
  },
});
