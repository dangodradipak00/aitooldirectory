CREATE TABLE IF NOT EXISTS "subcategories" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "parent_category_id" text NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE,
  "public_visible" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
-- statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subcategories_parent_slug_unique" ON "subcategories" ("parent_category_id", "slug");
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS "subcategories_parent_category_idx" ON "subcategories" ("parent_category_id");
