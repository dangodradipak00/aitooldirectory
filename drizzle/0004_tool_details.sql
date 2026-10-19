ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "website_image_url" text;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "details" jsonb;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "social_links" jsonb DEFAULT '[]'::jsonb NOT NULL;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "seo_title" text;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "seo_description" text;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "meta_keywords" text;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "verified" boolean DEFAULT false NOT NULL;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "affiliate" boolean DEFAULT false NOT NULL;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "follow_link" boolean DEFAULT false NOT NULL;
