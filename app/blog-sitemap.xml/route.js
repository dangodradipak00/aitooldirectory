import { absoluteUrl } from '../../lib/site';
import { getPublishedBlogs } from '../../lib/public-blogs';
import { createUrlSet, xmlResponse } from '../../lib/sitemap-xml';

export const dynamic = 'force-dynamic';

export async function GET() {
  const urls = (await getPublishedBlogs()).map((post) => absoluteUrl(`/blog/${post.slug}/`));
  return xmlResponse(createUrlSet(urls));
}
