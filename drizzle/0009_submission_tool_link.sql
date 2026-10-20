ALTER TABLE "tool_submissions" ADD COLUMN IF NOT EXISTS "promoted_tool_id" uuid;
-- statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "tool_submissions"
    ADD CONSTRAINT "tool_submissions_promoted_tool_id_tools_id_fk"
    FOREIGN KEY ("promoted_tool_id") REFERENCES "public"."tools"("id")
    ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS "tool_submissions_promoted_tool_idx" ON "tool_submissions" USING btree ("promoted_tool_id");
