import { publishedBlogs } from '../../data/blogs';
import { absoluteUrl } from '../../lib/site';
import { createUrlSet, xmlResponse } from '../../lib/sitemap-xml';

export const dynamic = 'force-static';

export function GET() {
  const urls = publishedBlogs.map((post) => absoluteUrl(`/blog/${post.slug}/`));
  return xmlResponse(createUrlSet(urls));
}
