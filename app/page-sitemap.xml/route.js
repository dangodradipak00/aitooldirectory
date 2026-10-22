import { absoluteUrl } from '../../lib/site';
import { createUrlSet, xmlResponse } from '../../lib/sitemap-xml';

export const dynamic = 'force-static';

const pagePaths = [
  '/', '/categories/', '/submit/', '/about/', '/contact/',
  '/authors/editorial-team/', '/privacy-policy/',
  '/cookie-policy/', '/terms-and-conditions/', '/refund-policy/', '/disclaimer/'
];

export function GET() {
  return xmlResponse(createUrlSet(pagePaths.map(absoluteUrl)));
}
