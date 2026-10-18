export function getVendorLinkRel(tool) {
  return tool.sponsored
    ? 'sponsored nofollow noopener noreferrer'
    : 'noopener noreferrer';
}
