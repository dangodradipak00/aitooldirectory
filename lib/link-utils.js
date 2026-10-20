export function getVendorLinkRel(tool) {
  if (tool.sponsored || tool.affiliate) {
    return 'sponsored nofollow noopener noreferrer';
  }
  return tool.followLink
    ? 'noopener noreferrer'
    : 'nofollow noopener noreferrer';
}

export function getVendorTrackingUrl(tool) {
  try {
    const url = new URL(tool.website);
    url.searchParams.set('ref', 'agencytoolguide');
    return url.toString();
  } catch {
    return tool.website;
  }
}
