export const categories = [
  {
    slug: 'client-reporting',
    name: 'Client Reporting',
    shortName: 'Reporting',
    description: 'Build clear, repeatable reports and dashboards for agency clients.',
    accent: 'blue'
  },
  {
    slug: 'seo-audits-rank-tracking',
    name: 'SEO Audits & Rank Tracking',
    shortName: 'SEO',
    description: 'Find technical issues and monitor organic search visibility.',
    accent: 'violet'
  },
  {
    slug: 'call-tracking-attribution',
    name: 'Call Tracking & Attribution',
    shortName: 'Call Tracking',
    description: 'Connect phone enquiries to the campaigns that generated them.',
    accent: 'orange'
  }
];

export const tools = [
  {
    slug: 'agencyanalytics',
    name: 'AgencyAnalytics',
    initials: 'AA',
    category: 'client-reporting',
    pricing: 'Paid',
    website: 'https://agencyanalytics.com/',
    summary: 'Reporting and dashboard software designed for marketing agencies managing multiple clients.',
    bestFor: 'Agencies that want scheduled reports, reusable dashboards and client-facing branding in one place.',
    highlights: ['Automated client reports', 'White-label dashboards', 'Multi-channel reporting']
  },
  {
    slug: 'dashthis',
    name: 'DashThis',
    initials: 'DT',
    category: 'client-reporting',
    pricing: 'Paid',
    website: 'https://dashthis.com/',
    summary: 'Marketing dashboard software focused on combining channel data into client-ready reports.',
    bestFor: 'Small teams that value straightforward templates and a focused reporting workflow.',
    highlights: ['Dashboard templates', 'Scheduled sharing', 'White-label options']
  },
  {
    slug: 'looker-studio',
    name: 'Looker Studio',
    initials: 'LS',
    category: 'client-reporting',
    pricing: 'Free option',
    website: 'https://lookerstudio.google.com/',
    summary: 'Google’s flexible data-visualisation tool for building custom dashboards and reports.',
    bestFor: 'Agencies comfortable creating tailored dashboards and managing their own data connectors.',
    highlights: ['Custom dashboards', 'Google data sources', 'Shareable reports']
  },
  {
    slug: 'screaming-frog',
    name: 'Screaming Frog SEO Spider',
    initials: 'SF',
    category: 'seo-audits-rank-tracking',
    pricing: 'Free option',
    website: 'https://www.screamingfrog.co.uk/seo-spider/',
    summary: 'Desktop website crawler used to inspect technical SEO issues across a site.',
    bestFor: 'SEO specialists who need detailed crawl data and control over technical audits.',
    highlights: ['Technical crawling', 'Redirect checks', 'Metadata auditing']
  },
  {
    slug: 'ahrefs',
    name: 'Ahrefs',
    initials: 'AH',
    category: 'seo-audits-rank-tracking',
    pricing: 'Paid',
    website: 'https://ahrefs.com/',
    summary: 'SEO research platform covering backlinks, keywords, site audits and rank tracking.',
    bestFor: 'Agencies running competitive research and ongoing organic-search campaigns.',
    highlights: ['Keyword research', 'Backlink analysis', 'Site auditing']
  },
  {
    slug: 'se-ranking',
    name: 'SE Ranking',
    initials: 'SR',
    category: 'seo-audits-rank-tracking',
    pricing: 'Paid',
    website: 'https://seranking.com/',
    summary: 'SEO platform with rank tracking, website auditing and agency reporting tools.',
    bestFor: 'Smaller agencies that need a broad SEO toolkit with client reporting options.',
    highlights: ['Rank tracking', 'Website audits', 'Agency reporting']
  },
  {
    slug: 'callrail',
    name: 'CallRail',
    initials: 'CR',
    category: 'call-tracking-attribution',
    pricing: 'Paid',
    website: 'https://www.callrail.com/',
    summary: 'Call tracking and lead attribution software for marketing teams and agencies.',
    bestFor: 'Lead-generation agencies that need to connect inbound calls with marketing sources.',
    highlights: ['Call attribution', 'Conversation insights', 'Lead tracking']
  },
  {
    slug: 'whatconverts',
    name: 'WhatConverts',
    initials: 'WC',
    category: 'call-tracking-attribution',
    pricing: 'Paid',
    website: 'https://www.whatconverts.com/',
    summary: 'Lead tracking platform covering calls, forms and chats with marketing attribution.',
    bestFor: 'Agencies that want one view of several lead types and their campaign sources.',
    highlights: ['Multi-lead tracking', 'Campaign attribution', 'Agency reporting']
  },
  {
    slug: 'calltrackingmetrics',
    name: 'CallTrackingMetrics',
    initials: 'CM',
    category: 'call-tracking-attribution',
    pricing: 'Paid',
    website: 'https://www.ctm.com/',
    summary: 'Conversation analytics and call tracking software with routing and attribution features.',
    bestFor: 'Agencies working with higher call volumes or more complex routing requirements.',
    highlights: ['Call tracking', 'Conversation analytics', 'Call routing']
  }
];

export function getCategory(slug) {
  return categories.find((category) => category.slug === slug);
}

export function getTool(slug) {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(categorySlug) {
  return tools.filter((tool) => tool.category === categorySlug);
}
