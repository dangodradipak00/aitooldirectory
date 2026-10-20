import { getCategory, getSubcategory } from './categories.js';

export const tools = [
  {
    slug: 'ahrefs', name: 'Ahrefs', initials: 'AH', pricing: 'Paid', published: true,
    primaryCategoryId: 'seo-marketing', secondaryCategoryIds: [],
    subcategoryIds: ['seo-marketing.keyword-research', 'seo-marketing.seo-audits', 'seo-marketing.rank-tracking'],
    website: 'https://ahrefs.com/',
    socialLinks: [
      { network: 'x', label: 'Ahrefs on X', url: 'https://x.com/ahrefs' },
      { network: 'facebook', label: 'Ahrefs on Facebook', url: 'https://www.facebook.com/Ahrefs/' },
      { network: 'youtube', label: 'Ahrefs on YouTube', url: 'https://www.youtube.com/@AhrefsCom' },
      { network: 'linkedin', label: 'Ahrefs on LinkedIn', url: 'https://www.linkedin.com/company/ahrefs/' },
      { network: 'email', label: 'Email Ahrefs support', url: 'mailto:support@ahrefs.com' }
    ],
    summary: 'SEO research platform covering backlinks, keywords, site audits and rank tracking.',
    bestFor: 'Agencies running competitive research and ongoing organic-search campaigns.',
    highlights: ['Keyword research', 'Backlink analysis', 'Site auditing'],
    details: {
      startingPrice: '€27/month for Starter',
      freeOption: 'Free limited access for verified websites',
      pricingVerified: '18 October 2026',
      audience: 'SEO agencies, consultants, in-house marketing teams and website owners that need research and monitoring in one platform.',
      introduction: 'Ahrefs is an SEO and search-visibility platform used to research competitors, discover keywords, analyse backlinks, audit websites and monitor organic rankings. Its toolset combines several recurring SEO workflows in a single web-based product.',
      features: [
        { name: 'Site Explorer', description: 'Research a website’s organic search performance, top pages, competitors and backlink profile.' },
        { name: 'Keywords Explorer', description: 'Find keyword ideas and evaluate metrics such as search demand, ranking difficulty and search intent.' },
        { name: 'Site Audit', description: 'Crawl a website to identify technical and on-page SEO issues that may need attention.' },
        { name: 'Rank Tracker', description: 'Monitor tracked keyword positions and compare visibility with selected competitors over time.' },
        { name: 'Content Explorer', description: 'Discover popular content and potential topics or link opportunities across the web.' }
      ],
      workflow: [
        'Create a project and verify or add the website you want to monitor.',
        'Run a Site Audit to establish a technical SEO baseline.',
        'Use Site Explorer and Keywords Explorer for competitor and keyword research.',
        'Add priority keywords to Rank Tracker and monitor changes over time.'
      ],
      pricingSummary: 'Ahrefs offers free limited access for verified websites, a Starter option and paid Lite, Standard, Advanced and Enterprise plans. Limits for projects, tracked keywords, crawl credits, reports and users vary by plan. Always confirm current pricing and allowances on the official pricing page before purchasing.',
      pros: [
        'Combines backlink, keyword, competitor, audit and rank-tracking workflows.',
        'Useful for researching both your own website and competing domains.',
        'Provides free limited tools and access for verified website owners.'
      ],
      cons: [
        'Full paid plans may be expensive for freelancers or very small teams.',
        'Usage limits, credits and add-ons require comparison before choosing a plan.',
        'The breadth of data and reports can take time for new users to learn.'
      ],
      useCases: [
        { name: 'Competitor research', description: 'Compare competing domains, their top pages, keywords and backlink sources.' },
        { name: 'Keyword planning', description: 'Build topic lists and assess which search queries align with a campaign.' },
        { name: 'Technical SEO audits', description: 'Find crawlability, internal linking and on-page issues across a website.' },
        { name: 'SEO performance monitoring', description: 'Track priority rankings and review organic visibility changes over time.' }
      ],
      editorialSummary: 'Ahrefs is a strong fit for teams that regularly perform competitor, keyword and backlink research and want those workflows alongside auditing and rank tracking. Smaller teams should compare the plan limits with their expected usage before subscribing. This overview is based on publicly available product information and is not a hands-on review.',
      faqs: [
        { question: 'What is Ahrefs used for?', answer: 'Ahrefs is used for keyword research, backlink analysis, competitor research, technical site audits and rank tracking. Agencies and marketing teams can use these tools to plan and monitor organic search campaigns.' },
        { question: 'Is Ahrefs free?', answer: 'Ahrefs provides free limited access for verified website owners and also offers free standalone SEO tools. Broader access, higher limits and advanced features require a paid plan.' },
        { question: 'Who is Ahrefs best for?', answer: 'Ahrefs is best suited to SEO agencies, consultants, in-house marketing teams and website owners who regularly need search, competitor and backlink data.' },
        { question: 'What are the main Ahrefs features?', answer: 'The main Ahrefs tools include Site Explorer, Keywords Explorer, Site Audit, Rank Tracker and Content Explorer. Feature access and usage limits depend on the selected plan.' },
        { question: 'How do I get started with Ahrefs?', answer: 'Create an Ahrefs account, add or verify your website and set up a project. You can then run a site audit, research competitors and keywords, and add important keywords to Rank Tracker.' }
      ]
    }
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
