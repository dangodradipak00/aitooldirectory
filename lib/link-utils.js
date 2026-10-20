export function getVendorLinkRel(tool) {
  if (tool.sponsored || tool.affiliate) {
    return 'sponsored nofollow noopener noreferrer';
  }
  return tool.followLink
    ? 'noopener noreferrer'
    : 'nofollow noopener noreferrer';
}
