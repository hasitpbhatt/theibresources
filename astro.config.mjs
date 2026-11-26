// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fieldnotesscience.pages.dev',
  output: 'static',
  integrations: [mdx(), sitemap()],
  build: {
    assets: '_astro',
  },
});
