import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://dada303312.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});

