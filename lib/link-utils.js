import { PAID_LINK_REL } from './homepage-config';

export function getVendorLinkRel(tool) {
  return tool.sponsored || tool.affiliate || tool.followLink
    ? PAID_LINK_REL
    : 'nofollow noopener noreferrer';
}

export function getVendorTrackingUrl(tool) {
  try {
    const url = new URL(tool.website);
    url.searchParams.set('ref', 'freemiumaitools');
    return url.toString();
  } catch {
    return tool.website;
  }
}
