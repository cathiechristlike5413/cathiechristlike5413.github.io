import type { APIRoute } from 'astro';
import { allTags, getPublishedPosts, postHref, slugifyTag } from '../lib/posts';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();
  const tags = allTags(posts);
  const origin = (site?.href || 'https://yourname.github.io').replace(/\/$/, '');
  const urls = ['/', '/archive/', '/tags/', '/about/', '/search/'];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls, ...tags.map((tag) => `/tags/${slugifyTag(tag)}/`), ...posts.map(postHref)]
  .map((path) => `  <url><loc>${origin}${path}</loc></url>`)
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
