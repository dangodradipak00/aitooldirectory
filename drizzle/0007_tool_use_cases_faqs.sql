ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "use_cases" jsonb DEFAULT '[]'::jsonb NOT NULL;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "faqs" jsonb DEFAULT '[]'::jsonb NOT NULL;
