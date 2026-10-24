const categoryIcons = {
  'writing-content': <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></>,
  'seo-marketing': <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m14 10 6-6M17 4h3v3"/></>,
  'social-media': <><circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="m7 11 10-5M7 13l10 5"/></>,
  'email-outreach': <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
  'ai-detection-content-checking': <><path d="m12 3 7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="m9 12 2 2 4-5"/></>,
  'image-generation-art': <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m4 17 5-5 4 4 2-2 5 4"/></>,
  'design-branding': <><path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h4a4 4 0 0 0 4-4c0-3-4-6-9-6Z"/><circle cx="7.5" cy="10" r=".7"/><circle cx="10" cy="7" r=".7"/><circle cx="14" cy="7" r=".7"/></>,
  'photo-editing-avatars': <><path d="M5 7h3l1.5-2h5L16 7h3a2 2 0 0 1 2 2v9H3V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/></>,
  'video-animation': <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/></>,
  'audio-music': <><path d="M9 18V6l9-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="15.5" cy="16" r="2.5"/></>,
  'meetings-transcription': <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></>,
  'coding-developer-tools': <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></>,
  'website-app-builders': <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></>,
  'automation-ai-agents': <><rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="15" width="6" height="5" rx="1"/><path d="M9 6.5h4a4 4 0 0 1 4 4V15M15 17.5h-4a4 4 0 0 1-4-4V9"/></>,
  'data-analytics': <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
  'chatbots-ai-assistants': <><path d="M4 5h16v12H9l-5 4z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></>,
  'productivity-knowledge': <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 2 2 5-5M8 17h8"/></>,
  'research-ai-search': <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M8 9h5M8 12h3"/></>,
  'presentations': <><path d="M4 4h16v12H4zM12 16v5M8 21h8M8 8h8M8 12h5"/></>,
  'sales-customer-support': <><path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 13h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM20 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2ZM17 19c-1 2-3 2-5 2"/></>,
  'business-hr': <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-4 2-6 6-6s6 2 6 6M15 15c4 0 6 2 6 5"/></>,
  'finance-accounting': <><circle cx="12" cy="12" r="9"/><path d="M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9M12 6v12"/></>,
  'legal-contracts': <><path d="M12 3v18M6 6h12M5 6l-3 7h6L5 6ZM19 6l-3 7h6l-3-7ZM8 21h8"/></>,
  'e-commerce': <><path d="M5 8h14l-1 13H6zM9 8a3 3 0 0 1 6 0"/></>,
  'education-learning': <><path d="m3 10 9-5 9 5-9 5zM7 12v5c3 2 7 2 10 0v-5M21 10v6"/></>,
  '3d-gaming': <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/></>,
  'lifestyle-entertainment': <><path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z"/><path d="m17 3 .5 1.5L19 5l-1.5.5L17 7l-.5-1.5L15 5l1.5-.5z"/></>,
  'healthcare-wellness': <><path d="M4 12h4l2-5 4 10 2-5h4"/><path d="M12 21S4 16.5 4 10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z"/></>
};

const categoryIconColors = {
  'writing-content': '#db2777',
  'seo-marketing': '#7c3aed',
  'social-media': '#e11d8a',
  'email-outreach': '#ea580c',
  'ai-detection-content-checking': '#4f46e5',
  'image-generation-art': '#9333ea',
  'design-branding': '#f43f5e',
  'photo-editing-avatars': '#c026d3',
  'video-animation': '#e11d48',
  'audio-music': '#d97706',
  'meetings-transcription': '#0891b2',
  'coding-developer-tools': '#0284c7',
  'website-app-builders': '#2563eb',
  'automation-ai-agents': '#16a34a',
  'data-analytics': '#0876d1',
  'chatbots-ai-assistants': '#0d9488',
  'productivity-knowledge': '#6366f1',
  'research-ai-search': '#2563eb',
  'presentations': '#f97316',
  'sales-customer-support': '#c2410c',
  'business-hr': '#7c3aed',
  'finance-accounting': '#059669',
  'legal-contracts': '#a16207',
  'e-commerce': '#db2777',
  'education-learning': '#4f46e5',
  '3d-gaming': '#8b5cf6',
  'lifestyle-entertainment': '#e11d48',
  'healthcare-wellness': '#dc2626'
};

const fallbackIcon = <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>;

export function getCategoryIconStyle(category) {
  return { '--category-icon-color': categoryIconColors[category.id] || categoryIconColors[category.slug] || '#0876d1' };
}

export default function CategoryIcon({ category }) {
  const icon = categoryIcons[category.id] || categoryIcons[category.slug] || fallbackIcon;
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>;
}
