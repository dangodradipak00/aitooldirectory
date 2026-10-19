ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "payment_status" text DEFAULT 'unpaid' NOT NULL;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "payment_provider" text;
-- statement-breakpoint
ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "payment_reference" text;
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS "tool_submissions_payment_status_idx" ON "tool_submissions" ("payment_status");
