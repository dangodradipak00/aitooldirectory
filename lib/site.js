const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agencytoolguide.com';

export const siteUrl = configuredUrl.replace(/\/$/, '');
export const siteName = 'AgencyToolGuide';
export const siteEmail = 'hello@agencytoolguide.com';
export const editorialTeamName = 'AgencyToolGuide Editorial Team';

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
