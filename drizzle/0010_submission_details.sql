ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "slug" text;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "logo_url" text;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "website_image_url" text;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "content_markdown" text;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "pricing" text DEFAULT 'Paid' NOT NULL;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "pros" jsonb DEFAULT '[]'::jsonb NOT NULL;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "cons" jsonb DEFAULT '[]'::jsonb NOT NULL;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "use_cases" jsonb DEFAULT '[]'::jsonb NOT NULL;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "faqs" jsonb DEFAULT '[]'::jsonb NOT NULL;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "social_links" jsonb DEFAULT '[]'::jsonb NOT NULL;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "seo_title" text;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "seo_description" text;
