import { getCategory, getSubcategory } from './categories';

export const tools = [
  {
    slug: 'agencyanalytics', name: 'AgencyAnalytics', initials: 'AA', pricing: 'Paid', published: true,
    primaryCategoryId: 'data-analytics', secondaryCategoryIds: ['seo-marketing'],
    subcategoryIds: ['data-analytics.reporting-dashboards', 'seo-marketing.marketing-analytics'],
    website: 'https://agencyanalytics.com/',
    summary: 'Reporting and dashboard software designed for marketing agencies managing multiple clients.',
    bestFor: 'Agencies that want scheduled reports, reusable dashboards and client-facing branding in one place.',
    highlights: ['Automated client reports', 'White-label dashboards', 'Multi-channel reporting']
  },
  {
    slug: 'dashthis', name: 'DashThis', initials: 'DT', pricing: 'Paid', published: true,
    primaryCategoryId: 'data-analytics', secondaryCategoryIds: ['seo-marketing'],
    subcategoryIds: ['data-analytics.reporting-dashboards', 'seo-marketing.marketing-analytics'],
    website: 'https://dashthis.com/',
    summary: 'Marketing dashboard software focused on combining channel data into client-ready reports.',
    bestFor: 'Small teams that value straightforward templates and a focused reporting workflow.',
    highlights: ['Dashboard templates', 'Scheduled sharing', 'White-label options']
  },
  {
    slug: 'looker-studio', name: 'Looker Studio', initials: 'LS', pricing: 'Free option', published: true,
    primaryCategoryId: 'data-analytics', secondaryCategoryIds: [],
    subcategoryIds: ['data-analytics.reporting-dashboards', 'data-analytics.data-visualization'],
    website: 'https://lookerstudio.google.com/',
    summary: 'Google’s flexible data-visualisation tool for building custom dashboards and reports.',
    bestFor: 'Agencies comfortable creating tailored dashboards and managing their own data connectors.',
    highlights: ['Custom dashboards', 'Google data sources', 'Shareable reports']
  },
  {
    slug: 'screaming-frog', name: 'Screaming Frog SEO Spider', initials: 'SF', pricing: 'Free option', published: true,
    primaryCategoryId: 'seo-marketing', secondaryCategoryIds: [], subcategoryIds: ['seo-marketing.seo-audits'],
    website: 'https://www.screamingfrog.co.uk/seo-spider/',
    summary: 'Desktop website crawler used to inspect technical SEO issues across a site.',
    bestFor: 'SEO specialists who need detailed crawl data and control over technical audits.',
    highlights: ['Technical crawling', 'Redirect checks', 'Metadata auditing']
  },
  {
    slug: 'ahrefs', name: 'Ahrefs', initials: 'AH', pricing: 'Paid', published: true,
    primaryCategoryId: 'seo-marketing', secondaryCategoryIds: [],
    subcategoryIds: ['seo-marketing.keyword-research', 'seo-marketing.seo-audits', 'seo-marketing.rank-tracking'],
    website: 'https://ahrefs.com/',
    summary: 'SEO research platform covering backlinks, keywords, site audits and rank tracking.',
    bestFor: 'Agencies running competitive research and ongoing organic-search campaigns.',
    highlights: ['Keyword research', 'Backlink analysis', 'Site auditing']
  },
  {
    slug: 'se-ranking', name: 'SE Ranking', initials: 'SR', pricing: 'Paid', published: true,
    primaryCategoryId: 'seo-marketing', secondaryCategoryIds: [],
    subcategoryIds: ['seo-marketing.seo-audits', 'seo-marketing.rank-tracking'],
    website: 'https://seranking.com/',
    summary: 'SEO platform with rank tracking, website auditing and agency reporting tools.',
    bestFor: 'Smaller agencies that need a broad SEO toolkit with client reporting options.',
    highlights: ['Rank tracking', 'Website audits', 'Agency reporting']
  },
  {
    slug: 'callrail', name: 'CallRail', initials: 'CR', pricing: 'Paid', published: true,
    primaryCategoryId: 'sales-customer-support', secondaryCategoryIds: ['seo-marketing'],
    subcategoryIds: ['sales-customer-support.call-tracking-conversation-analytics', 'seo-marketing.marketing-analytics'],
    website: 'https://www.callrail.com/',
    summary: 'Call tracking and lead attribution software for marketing teams and agencies.',
    bestFor: 'Lead-generation agencies that need to connect inbound calls with marketing sources.',
    highlights: ['Call attribution', 'Conversation insights', 'Lead tracking']
  },
  {
    slug: 'whatconverts', name: 'WhatConverts', initials: 'WC', pricing: 'Paid', published: true,
    primaryCategoryId: 'sales-customer-support', secondaryCategoryIds: ['seo-marketing'],
    subcategoryIds: ['sales-customer-support.call-tracking-conversation-analytics', 'seo-marketing.marketing-analytics'],
    website: 'https://www.whatconverts.com/',
    summary: 'Lead tracking platform covering calls, forms and chats with marketing attribution.',
    bestFor: 'Agencies that want one view of several lead types and their campaign sources.',
    highlights: ['Multi-lead tracking', 'Campaign attribution', 'Agency reporting']
  },
  {
    slug: 'calltrackingmetrics', name: 'CallTrackingMetrics', initials: 'CM', pricing: 'Paid', published: true,
    primaryCategoryId: 'sales-customer-support', secondaryCategoryIds: [],
    subcategoryIds: ['sales-customer-support.call-tracking-conversation-analytics'],
    website: 'https://www.ctm.com/',
    summary: 'Conversation analytics and call tracking software with routing and attribution features.',
    bestFor: 'Agencies working with higher call volumes or more complex routing requirements.',
    highlights: ['Call tracking', 'Conversation analytics', 'Call routing']
  }
];

export const publishedTools = tools.filter((tool) => tool.published);

for (const tool of tools) {
  const categoryIds = [tool.primaryCategoryId, ...tool.secondaryCategoryIds];
  if (!getCategory(tool.primaryCategoryId) || tool.secondaryCategoryIds.length > 2 || new Set(categoryIds).size !== categoryIds.length) {
    throw new Error(`Invalid category assignment for ${tool.slug}.`);
  }
  for (const subcategoryId of tool.subcategoryIds) {
    const subcategory = getSubcategory(subcategoryId);
    if (!subcategory || !categoryIds.includes(subcategory.parentCategoryId)) {
      throw new Error(`Invalid subcategory assignment for ${tool.slug}: ${subcategoryId}.`);
    }
  }
}

export function getTool(slug) {
  return tools.find((tool) => tool.slug === slug);
}

export function isToolInCategory(tool, categoryId) {
  return tool.primaryCategoryId === categoryId || tool.secondaryCategoryIds.includes(categoryId);
}

export function getToolsByCategory(categoryId) {
  return publishedTools.filter((tool) => isToolInCategory(tool, categoryId));
}

export function getToolCategories(tool) {
  return [tool.primaryCategoryId, ...tool.secondaryCategoryIds]
    .map(getCategory)
    .filter(Boolean);
}

export function getCategoryToolCount(categoryId) {
  return new Set(getToolsByCategory(categoryId).map((tool) => tool.slug)).size;
}
