DO $$ BEGIN
  CREATE TYPE "content_status" AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
-- statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "submission_status" AS ENUM ('pending', 'in_review', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "public_visible" boolean DEFAULT true NOT NULL,
  "selected_on_homepage" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
-- statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_unique" ON "categories" ("slug");
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS "tools" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "website" text NOT NULL,
  "summary" text NOT NULL,
  "best_for" text DEFAULT '' NOT NULL,
  "pricing" text DEFAULT 'Contact vendor' NOT NULL,
  "logo_url" text,
  "primary_category_id" text REFERENCES "categories"("id") ON DELETE SET NULL,
  "secondary_category_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "subcategory_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "status" "content_status" DEFAULT 'draft' NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "submitted_by_auth_id" text,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
-- statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tools_slug_unique" ON "tools" ("slug");
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS "tools_status_idx" ON "tools" ("status");
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS "tools_primary_category_idx" ON "tools" ("primary_category_id");
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS "tool_submissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "tool_name" text NOT NULL,
  "website" text NOT NULL,
  "description" text NOT NULL,
  "submitter_name" text NOT NULL,
  "submitter_email" text NOT NULL,
  "primary_category_id" text,
  "secondary_category_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "subcategory_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "category_suggestion" text,
  "status" "submission_status" DEFAULT 'pending' NOT NULL,
  "review_notes" text,
  "submitted_by_auth_id" text,
  "reviewed_by_auth_id" text,
  "reviewed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS "tool_submissions_status_idx" ON "tool_submissions" ("status");
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "excerpt" text DEFAULT '' NOT NULL,
  "content" text DEFAULT '' NOT NULL,
  "cover_image_url" text,
  "seo_title" text,
  "seo_description" text,
  "status" "content_status" DEFAULT 'draft' NOT NULL,
  "author_auth_id" text,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
-- statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_unique" ON "blog_posts" ("slug");
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_posts_status_idx" ON "blog_posts" ("status");
