import { mainCategories } from '../../data/categories';
import { absoluteUrl } from '../../lib/site';
import { createUrlSet, xmlResponse } from '../../lib/sitemap-xml';

export const dynamic = 'force-static';

export function GET() {
  const urls = mainCategories
    .map((category) => absoluteUrl(`/categories/${category.slug}/`));
  return xmlResponse(createUrlSet(urls));
}
