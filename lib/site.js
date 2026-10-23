const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freemiumaitools.com';

export const siteUrl = configuredUrl.replace(/\/$/, '');
export const siteName = 'FreemiumAITools';
export const siteEmail = 'hello@freemiumaitools.com';
export const editorialTeamName = 'FreemiumAITools Editorial Team';

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
