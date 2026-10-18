const subcategory = (parentCategoryId, slug, name, searchSynonyms = []) => ({
  id: `${parentCategoryId}.${slug}`,
  parentCategoryId,
  name,
  slug,
  description: `Tools focused on ${name.toLowerCase()} workflows.`,
  searchSynonyms
});

const category = ({
  id,
  slug,
  name,
  description,
  subcategories,
  searchSynonyms = [],
  publicVisible = false,
  selectedOnHomepage = false,
  accent = 'blue'
}) => ({
  id,
  slug: slug || id,
  name,
  description,
  searchSynonyms,
  classificationAvailable: true,
  publicVisible,
  selectedOnHomepage,
  accent,
  subcategories: subcategories.map(([slug, subcategoryName, synonyms = []]) =>
    subcategory(id, slug, subcategoryName, synonyms)
  )
});

export const mainCategories = [
  category({ id: 'writing-content', name: 'Writing & Content', description: 'Create, improve and adapt written content for different formats and audiences.', subcategories: [['copywriting', 'Copywriting'], ['blog-article-writing', 'Blog & Article Writing'], ['storytelling', 'Storytelling'], ['paraphrasing', 'Paraphrasing'], ['summarizing', 'Summarizing', ['summarizer']], ['grammar-proofreading', 'Grammar & Proofreading'], ['translation', 'Translation'], ['scriptwriting', 'Scriptwriting'], ['prompt-libraries', 'Prompt Libraries']] }),
  category({ id: 'seo-marketing', name: 'SEO & Marketing', description: 'Research, optimize, measure and grow organic and paid marketing performance.', publicVisible: true, selectedOnHomepage: true, accent: 'violet', subcategories: [['keyword-research', 'Keyword Research'], ['content-optimization', 'Content Optimization'], ['seo-audits', 'SEO Audits'], ['rank-tracking', 'Rank Tracking'], ['advertising-campaigns', 'Advertising & Campaigns'], ['marketing-analytics', 'Marketing Analytics']] }),
  category({ id: 'social-media', name: 'Social Media', description: 'Plan, publish and measure content across social channels.', subcategories: [['posts-captions', 'Posts & Captions'], ['social-scheduling', 'Social Scheduling'], ['social-analytics', 'Social Analytics'], ['influencer-tools', 'Influencer Tools'], ['virtual-influencers', 'Virtual Influencers']] }),
  category({ id: 'email-outreach', name: 'Email & Outreach', description: 'Write, manage and automate email communication and outreach.', subcategories: [['email-writing', 'Email Writing'], ['inbox-management', 'Inbox Management'], ['cold-outreach', 'Cold Outreach'], ['email-marketing', 'Email Marketing']] }),
  category({ id: 'ai-detection-content-checking', slug: 'ai-detection-content', name: 'AI Detection & Content', description: 'Review content for originality, reliability and AI-generation signals.', subcategories: [['ai-content-detection', 'AI Content Detection'], ['content-humanizing', 'Content Humanizing'], ['plagiarism-checking', 'Plagiarism Checking'], ['fact-checking', 'Fact Checking']] }),
  category({ id: 'image-generation-art', slug: 'image-generation', name: 'Image Generation', description: 'Generate original images, illustrations and visual variations.', subcategories: [['text-to-image', 'Text to Image'], ['ai-art-illustration', 'AI Art & Illustration'], ['anime-generation', 'Anime Generation'], ['image-variations', 'Image Variations']] }),
  category({ id: 'design-branding', name: 'Design & Branding', description: 'Create brand identities, interfaces and visual design assets.', subcategories: [['logo-design', 'Logo Design'], ['graphic-design', 'Graphic Design'], ['ui-ux-design', 'UI & UX Design'], ['brand-assets', 'Brand Assets'], ['interior-architectural-design', 'Interior & Architectural Design'], ['real-estate-virtual-staging', 'Real Estate & Virtual Staging'], ['fashion-styling', 'Fashion & Styling']] }),
  category({ id: 'photo-editing-avatars', name: 'Photo Editing & Avatars', description: 'Enhance photographs and create portraits, avatars and visual identities.', subcategories: [['photo-enhancement', 'Photo Enhancement'], ['background-removal', 'Background Removal'], ['object-removal', 'Object Removal'], ['image-upscaling', 'Image Upscaling'], ['headshots', 'Headshots'], ['avatars', 'Avatars'], ['face-editing', 'Face Editing'], ['virtual-try-on', 'Virtual Try-On']] }),
  category({ id: 'video-animation', name: 'Video & Animation', description: 'Generate, edit and enhance videos, animations and presenter content.', subcategories: [['video-generation', 'Video Generation'], ['video-editing', 'Video Editing'], ['animation', 'Animation'], ['ai-presenters', 'AI Presenters'], ['personalized-videos', 'Personalized Videos'], ['captions-subtitles', 'Captions & Subtitles']] }),
  category({ id: 'audio-music', name: 'Audio & Music', description: 'Create, edit and improve speech, music, podcasts and other audio.', subcategories: [['music-generation', 'Music Generation'], ['text-to-speech', 'Text to Speech', ['text to speech']], ['voice-cloning', 'Voice Cloning'], ['audio-editing', 'Audio Editing'], ['noise-removal', 'Noise Removal'], ['podcast-tools', 'Podcast Tools']] }),
  category({ id: 'meetings-transcription', name: 'Meetings & Transcription', description: 'Capture spoken conversations and turn meetings into usable records.', subcategories: [['speech-to-text', 'Speech to Text', ['transcriber']], ['meeting-notes', 'Meeting Notes'], ['meeting-summaries', 'Meeting Summaries'], ['meeting-assistants', 'Meeting Assistants']] }),
  category({ id: 'coding-developer-tools', name: 'Coding & Developer Tools', description: 'Build, test, secure and operate software and AI systems.', subcategories: [['code-generation', 'Code Generation'], ['coding-assistants', 'Coding Assistants'], ['code-review-debugging', 'Code Review & Debugging'], ['software-testing', 'Software Testing'], ['sql-database-tools', 'SQL & Database Tools'], ['api-sdk-tools', 'API & SDK Tools'], ['ai-security-authentication', 'AI Security & Authentication'], ['monitoring-observability', 'Monitoring & Observability'], ['model-training-serving', 'Model Training & Serving'], ['developer-sandboxes', 'Developer Sandboxes'], ['mcp-tools', 'MCP Tools']] }),
  category({ id: 'website-app-builders', name: 'Website & App Builders', description: 'Build websites and applications with visual, assisted or low-code workflows.', subcategories: [['website-builders', 'Website Builders'], ['landing-page-builders', 'Landing Page Builders'], ['mobile-app-builders', 'Mobile App Builders'], ['web-app-builders', 'Web App Builders'], ['no-code-low-code', 'No-Code & Low-Code', ['no code', 'low code']]] }),
  category({ id: 'automation-ai-agents', name: 'Automation & AI Agents', description: 'Automate multi-step work across browsers, desktops and connected applications.', subcategories: [['workflow-automation', 'Workflow Automation'], ['browser-agents', 'Browser Agents'], ['desktop-agents', 'Desktop Agents'], ['agent-builders-platforms', 'Agent Builders & Platforms'], ['agent-frameworks', 'Agent Frameworks'], ['multi-agent-systems', 'Multi-Agent Systems'], ['app-integrations', 'App Integrations'], ['remote-monitoring', 'Remote Monitoring']] }),
  category({ id: 'data-analytics', name: 'Data & Analytics', description: 'Collect, analyse, visualise and report data for clearer decisions.', publicVisible: true, selectedOnHomepage: true, accent: 'blue', subcategories: [['spreadsheet-tools', 'Spreadsheet Tools'], ['data-analysis-data-science', 'Data Analysis & Data Science'], ['data-visualization', 'Data Visualization'], ['reporting-dashboards', 'Reporting & Dashboards'], ['data-extraction', 'Data Extraction'], ['web-scraping', 'Web Scraping'], ['surveys-feedback', 'Surveys & Feedback']] }),
  category({ id: 'chatbots-ai-assistants', name: 'Chatbots & AI Assistants', description: 'Provide conversational support, personal assistance and custom chatbot experiences.', subcategories: [['general-ai-assistants', 'General AI Assistants'], ['custom-chatbots', 'Custom Chatbots'], ['personal-life-assistants', 'Personal & Life Assistants'], ['ai-companions', 'AI Companions'], ['conversational-voice-agents', 'Conversational Voice Agents']] }),
  category({ id: 'productivity-knowledge', name: 'Productivity & Knowledge', description: 'Organise tasks, documents, schedules and reusable knowledge.', subcategories: [['note-taking', 'Note Taking'], ['task-project-management', 'Task & Project Management'], ['document-management', 'Document Management'], ['knowledge-bases', 'Knowledge Bases'], ['memory-personalization', 'Memory & Personalization'], ['scheduling', 'Scheduling']] }),
  category({ id: 'research-ai-search', name: 'Research & AI Search', description: 'Find, review and organise information from the web, documents and research sources.', subcategories: [['web-research', 'Web Research'], ['academic-research', 'Academic Research'], ['ai-search-engines', 'AI Search Engines'], ['document-pdf-research', 'Document & PDF Research'], ['ai-directories-tool-libraries', 'AI Directories & Tool Libraries']] }),
  category({ id: 'presentations', name: 'Presentations', description: 'Create, structure and design presentations and pitch materials.', subcategories: [['slide-generation', 'Slide Generation'], ['pitch-decks', 'Pitch Decks'], ['presentation-design', 'Presentation Design']] }),
  category({ id: 'sales-customer-support', name: 'Sales & Customer Support', description: 'Generate leads, manage customer conversations and support revenue teams.', publicVisible: true, selectedOnHomepage: true, accent: 'orange', subcategories: [['lead-generation', 'Lead Generation'], ['sales-assistants', 'Sales Assistants'], ['crm-assistance', 'CRM Assistance'], ['customer-support', 'Customer Support'], ['helpdesk-tools', 'Helpdesk Tools'], ['call-tracking-conversation-analytics', 'Call Tracking & Conversation Analytics']] }),
  category({ id: 'business-hr', name: 'Business & HR', description: 'Plan and operate businesses, hiring and people workflows.', subcategories: [['business-planning', 'Business Planning'], ['startup-tools', 'Startup Tools'], ['recruiting', 'Recruiting'], ['resume-career-tools', 'Resume & Career Tools'], ['hr-operations', 'HR Operations'], ['purchasing-procurement', 'Purchasing & Procurement']] }),
  category({ id: 'finance-accounting', name: 'Finance & Accounting', description: 'Manage money, accounting, forecasting and financial research.', subcategories: [['bookkeeping-accounting', 'Bookkeeping & Accounting'], ['invoicing', 'Invoicing'], ['expense-management', 'Expense Management'], ['budgeting-forecasting', 'Budgeting & Forecasting'], ['financial-analysis', 'Financial Analysis'], ['investment-research', 'Investment Research'], ['payments', 'Payments'], ['insurance-assistance', 'Insurance Assistance'], ['blockchain-web3-tools', 'Blockchain & Web3 Tools']] }),
  category({ id: 'legal-contracts', name: 'Legal & Contracts', description: 'Research legal questions and create, review and manage contracts.', searchSynonyms: ['law'], subcategories: [['legal-research', 'Legal Research'], ['contract-drafting', 'Contract Drafting'], ['contract-review', 'Contract Review'], ['legal-document-management', 'Legal Document Management']] }),
  category({ id: 'e-commerce', name: 'E-commerce', description: 'Create product content and operate online stores and merchandising.', subcategories: [['product-descriptions', 'Product Descriptions'], ['product-photography', 'Product Photography'], ['shopping-assistants', 'Shopping Assistants'], ['store-management', 'Store Management'], ['pricing-merchandising', 'Pricing & Merchandising']] }),
  category({ id: 'education-learning', name: 'Education & Learning', description: 'Support teaching, studying, training and course creation.', subcategories: [['ai-tutors', 'AI Tutors'], ['language-learning', 'Language Learning'], ['exam-preparation', 'Exam Preparation'], ['course-creation', 'Course Creation'], ['teacher-tools', 'Teacher Tools'], ['ai-learning-resources', 'AI Learning Resources']] }),
  category({ id: '3d-gaming', name: '3D & Gaming', description: 'Create 3D assets, games, textures and interactive gaming experiences.', subcategories: [['3d-model-generation', '3D Model Generation'], ['3d-textures-animation', '3D Textures & Animation'], ['game-development', 'Game Development'], ['game-assets', 'Game Assets'], ['gaming-assistants', 'Gaming Assistants']] }),
  category({ id: 'nsfw-ai', name: 'NSFW AI', description: 'Discover age-restricted AI tools for adult-oriented creative and conversational experiences.', subcategories: [['nsfw-image-generation', 'NSFW Image Generation'], ['nsfw-video-generation', 'NSFW Video Generation'], ['adult-ai-chatbots', 'Adult AI Chatbots'], ['ai-companions', 'AI Companions'], ['adult-content-creation', 'Adult Content Creation']] }),
  category({ id: 'lifestyle-entertainment', name: 'Lifestyle & Entertainment', description: 'Plan everyday activities, travel, food, fitness and entertainment.', subcategories: [['travel-planning', 'Travel Planning'], ['fitness-workout-planning', 'Fitness & Workout Planning'], ['meal-planning-recipes', 'Meal Planning & Recipes'], ['gift-ideas', 'Gift Ideas'], ['fun-entertainment', 'Fun & Entertainment']] }),
  category({ id: 'healthcare-wellness', name: 'Healthcare & Wellness', description: 'Support clinical, administrative, research and personal wellness workflows.', subcategories: [['clinical-documentation', 'Clinical Documentation'], ['medical-research-tools', 'Medical Research Tools'], ['healthcare-administration', 'Healthcare Administration'], ['patient-communication', 'Patient Communication'], ['wellness-self-care', 'Wellness & Self-Care']] })
];

export const subcategories = mainCategories.flatMap((item) => item.subcategories);

if (mainCategories.length !== 29 || new Set(mainCategories.map((item) => item.id)).size !== mainCategories.length) {
  throw new Error('The category taxonomy must contain 29 uniquely identified main categories.');
}
if (new Set(subcategories.map((item) => item.id)).size !== subcategories.length) {
  throw new Error('Every subcategory must have a unique identifier.');
}

export const categoryAliases = {
  'client-reporting': 'data-analytics',
  'seo-audits-rank-tracking': 'seo-marketing',
  'call-tracking-attribution': 'sales-customer-support',
  'image-generation-art': 'image-generation',
  'ai-detection-content-checking': 'ai-detection-content'
};

export const homepageCategoryIds = [
  'seo-marketing',
  'data-analytics',
  'sales-customer-support',
  'writing-content',
  'social-media',
  'image-generation-art',
  'video-animation',
  'audio-music',
  'coding-developer-tools',
  'automation-ai-agents',
  'chatbots-ai-assistants',
  'productivity-knowledge'
];

export function getCategory(categoryIdOrSlug) {
  return mainCategories.find((item) => item.id === categoryIdOrSlug || item.slug === categoryIdOrSlug);
}

export function getSubcategory(subcategoryId) {
  return subcategories.find((item) => item.id === subcategoryId);
}

export function resolveCategorySlug(slug) {
  const canonicalSlug = categoryAliases[slug] || slug;
  return {
    category: getCategory(canonicalSlug),
    isLegacy: Boolean(categoryAliases[slug]),
    canonicalSlug
  };
}

export function getCategorySearchText(item) {
  return [
    item.name,
    item.description,
    ...item.searchSynonyms,
    ...item.subcategories.flatMap((sub) => [sub.name, sub.description, ...sub.searchSynonyms])
  ].join(' ').toLowerCase();
}
