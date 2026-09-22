import type { APIRoute } from 'astro';
import { formatDate, getPublishedPosts, postHref } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const data = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    date: formatDate(post.data.pubDate),
    pubDate: post.data.pubDate.toISOString(),
    category: post.data.category,
    tags: post.data.tags,
    url: postHref(post),
  }));

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
