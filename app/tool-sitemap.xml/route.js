import { publishedTools } from '../../data/tools';
import { absoluteUrl } from '../../lib/site';
import { createUrlSet, xmlResponse } from '../../lib/sitemap-xml';

export const dynamic = 'force-static';

export function GET() {
  const urls = publishedTools.map((tool) => absoluteUrl(`/tools/${tool.slug}/`));
  return xmlResponse(createUrlSet(urls));
}
