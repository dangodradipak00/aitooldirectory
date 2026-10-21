import { boolean, index, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const contentStatus = pgEnum('content_status', ['draft', 'published', 'archived']);
export const submissionStatus = pgEnum('submission_status', ['pending', 'in_review', 'approved', 'rejected']);

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
};

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  publicVisible: boolean('public_visible').notNull().default(true),
  selectedOnHomepage: boolean('selected_on_homepage').notNull().default(false),
  ...timestamps
}, (table) => [uniqueIndex('categories_slug_unique').on(table.slug)]);

export const subcategories = pgTable('subcategories', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  parentCategoryId: text('parent_category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  publicVisible: boolean('public_visible').notNull().default(true),
  ...timestamps
}, (table) => [
  uniqueIndex('subcategories_parent_slug_unique').on(table.parentCategoryId, table.slug),
  index('subcategories_parent_category_idx').on(table.parentCategoryId)
]);

export const tools = pgTable('tools', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  website: text('website').notNull(),
  summary: text('summary').notNull(),
  bestFor: text('best_for').notNull().default(''),
  pricing: text('pricing').notNull().default('Contact vendor'),
  logoUrl: text('logo_url'),
  websiteImageUrl: text('website_image_url'),
  contentMarkdown: text('content_markdown'),
  conclusion: text('conclusion'),
  pros: jsonb('pros').$type<string[]>().notNull().default([]),
  cons: jsonb('cons').$type<string[]>().notNull().default([]),
  features: jsonb('features').$type<Array<{ title: string; description: string }>>().notNull().default([]),
  useCases: jsonb('use_cases').$type<Array<{ title: string; description: string }>>().notNull().default([]),
  faqs: jsonb('faqs').$type<Array<{ question: string; answer: string }>>().notNull().default([]),
  primaryCategoryId: text('primary_category_id').references(() => categories.id, { onDelete: 'set null' }),
  secondaryCategoryIds: jsonb('secondary_category_ids').$type<string[]>().notNull().default([]),
  subcategoryIds: jsonb('subcategory_ids').$type<string[]>().notNull().default([]),
  highlights: jsonb('highlights').$type<string[]>().notNull().default([]),
  details: jsonb('details').$type<Record<string, unknown> | null>(),
  socialLinks: jsonb('social_links').$type<Array<{ network: string; label: string; url: string }>>().notNull().default([]),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  metaKeywords: text('meta_keywords'),
  verified: boolean('verified').notNull().default(false),
  affiliate: boolean('affiliate').notNull().default(false),
  followLink: boolean('follow_link').notNull().default(false),
  status: contentStatus('status').notNull().default('draft'),
  featured: boolean('featured').notNull().default(false),
  submittedByAuthId: text('submitted_by_auth_id'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  ...timestamps
}, (table) => [
  uniqueIndex('tools_slug_unique').on(table.slug),
  index('tools_status_idx').on(table.status),
  index('tools_primary_category_idx').on(table.primaryCategoryId)
]);

export const toolSubmissions = pgTable('tool_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  toolName: text('tool_name').notNull(),
  website: text('website').notNull(),
  description: text('description').notNull(),
  slug: text('slug'),
  logoUrl: text('logo_url'),
  websiteImageUrl: text('website_image_url'),
  contentMarkdown: text('content_markdown'),
  pricing: text('pricing').notNull().default('Paid'),
  pros: jsonb('pros').$type<string[]>().notNull().default([]),
  cons: jsonb('cons').$type<string[]>().notNull().default([]),
  useCases: jsonb('use_cases').$type<Array<{ title: string; description: string }>>().notNull().default([]),
  faqs: jsonb('faqs').$type<Array<{ question: string; answer: string }>>().notNull().default([]),
  socialLinks: jsonb('social_links').$type<Array<{ network: string; label: string; url: string }>>().notNull().default([]),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  submitterName: text('submitter_name').notNull(),
  submitterEmail: text('submitter_email').notNull(),
  primaryCategoryId: text('primary_category_id'),
  secondaryCategoryIds: jsonb('secondary_category_ids').$type<string[]>().notNull().default([]),
  subcategoryIds: jsonb('subcategory_ids').$type<string[]>().notNull().default([]),
  categorySuggestion: text('category_suggestion'),
  paymentStatus: text('payment_status').notNull().default('unpaid'),
  paymentProvider: text('payment_provider'),
  paymentReference: text('payment_reference'),
  status: submissionStatus('status').notNull().default('pending'),
  reviewNotes: text('review_notes'),
  submittedByAuthId: text('submitted_by_auth_id'),
  reviewedByAuthId: text('reviewed_by_auth_id'),
  promotedToolId: uuid('promoted_tool_id').references(() => tools.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  ...timestamps
}, (table) => [
  index('tool_submissions_status_idx').on(table.status),
  index('tool_submissions_promoted_tool_idx').on(table.promotedToolId)
]);

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull().default(''),
  coverImageUrl: text('cover_image_url'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  faqs: jsonb('faqs').$type<Array<{ question: string; answer: string }>>().notNull().default([]),
  status: contentStatus('status').notNull().default('draft'),
  authorAuthId: text('author_auth_id'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  ...timestamps
}, (table) => [
  uniqueIndex('blog_posts_slug_unique').on(table.slug),
  index('blog_posts_status_idx').on(table.status)
]);

export type Tool = typeof tools.$inferSelect;
export type Subcategory = typeof subcategories.$inferSelect;
export type ToolSubmission = typeof toolSubmissions.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
