import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gradatum.org',
  integrations: [
    sitemap(),
  ],
  output: 'static',
  build: {
    assets: '_assets',
  },
});
