import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { getPublishedPosts, postHref } from '../lib/posts';

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();
  const origin = (site?.href || 'https://yourname.github.io').replace(/\/$/, '');
  const items = posts.map((post) => {
    const url = `${origin}${postHref(post)}`;
    return `
      <item>
        <title>${escapeXml(post.data.title)}</title>
        <link>${escapeXml(url)}</link>
        <guid isPermaLink="true">${escapeXml(url)}</guid>
        <description>${escapeXml(post.data.description)}</description>
        <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
        ${post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}
      </item>`;
  }).join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <description>${escapeXml(SITE.description)}</description>
    <link>${escapeXml(origin)}</link>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${origin}/rss.xml`)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
