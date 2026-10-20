import { absoluteUrl } from '../../lib/site';
import { createUrlSet, xmlResponse } from '../../lib/sitemap-xml';
import { getPublicCategories } from '../../lib/public-categories';

export const dynamic = 'force-dynamic';

export async function GET() {
  const urls = (await getPublicCategories())
    .map((category) => absoluteUrl(`/categories/${category.slug}/`));
  return xmlResponse(createUrlSet(urls));
}
