const paidLinkTokens = (process.env.PAID_LINK_REL || 'sponsored noopener noreferrer')
  .trim()
  .split(/\s+/)
  .filter(Boolean);

export const PAID_LINK_REL = [...new Set([...paidLinkTokens, 'noopener', 'noreferrer'])].join(' ');

export const submissionPlans = [
  {
    id: 'free',
    name: 'Free submission',
    price: '$0',
    features: [
      'Your tool is reviewed and, if approved, added to the directory',
      'Link to your website with rel="nofollow"'
    ],
    buttonLabel: 'Submit for free',
    href: '/submit/'
  },
  {
    id: 'editorial',
    name: 'Editorial profile',
    price: 'from $9',
    features: [
      'Full editorial tool profile page',
      'Link to your website (rel attribute controlled by PAID_LINK_REL)'
    ],
    buttonLabel: 'Get an editorial profile',
    href: '/submit/',
    recommended: true
  }
];

export const homepageFaqs = [
  {
    question: 'Is FreemiumAItools free to use?',
    answer: 'Yes. Browsing the directory and reading reviews is free, and you can submit your AI tool for free. An editorial profile with a link to your site starts from $9.'
  },
  {
    question: 'How do you review AI tools?',
    answer: 'We sign up, test each tool on real tasks and publish our own screenshots along with pricing and free plan limits.'
  },
  {
    question: 'What is a freemium AI tool?',
    answer: 'A freemium tool has a free plan and paid upgrades. You can start free and pay only when you need more features or higher limits.'
  },
  {
    question: 'Which AI tools are free?',
    answer: 'Check the pricing section of each review. We note whether a tool has a free plan, a free trial or only paid plans, and what the free plan limits are.'
  },
  {
    question: 'How do I submit my AI tool?',
    answer: 'Go to the Submit page and send your tool details. Free submissions are reviewed and added if approved. If you want an editorial profile, choose a paid plan; we review the submission before you pay.'
  },
  {
    question: 'Does paying for a profile change the review?',
    answer: 'No. Submitting a tool, free or paid, does not guarantee a positive review. We disclose commercial relationships and do not guarantee traffic or rankings.'
  }
];

export const reviewer = {
  name: process.env.REVIEWER_NAME?.trim() || '',
  role: process.env.REVIEWER_ROLE?.trim() || '',
  bio: process.env.REVIEWER_BIO?.trim() || '',
  photo: process.env.REVIEWER_PHOTO?.trim() || ''
};
