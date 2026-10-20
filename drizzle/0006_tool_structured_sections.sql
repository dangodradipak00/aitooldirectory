ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "pros" jsonb DEFAULT '[]'::jsonb NOT NULL;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "cons" jsonb DEFAULT '[]'::jsonb NOT NULL;
-- statement-breakpoint
ALTER TABLE "tools" ADD COLUMN IF NOT EXISTS "features" jsonb DEFAULT '[]'::jsonb NOT NULL;
