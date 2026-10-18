import { absoluteUrl } from '../../lib/site';
import { createSitemapIndex, xmlResponse } from '../../lib/sitemap-xml';

export const dynamic = 'force-static';

export function GET() {
  return xmlResponse(createSitemapIndex([
    absoluteUrl('/page-sitemap.xml'),
    absoluteUrl('/category-sitemap.xml'),
    absoluteUrl('/tool-sitemap.xml'),
    absoluteUrl('/blog-sitemap.xml')
  ]));
}
