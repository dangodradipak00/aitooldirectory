ALTER TABLE "blog_posts"
ADD COLUMN IF NOT EXISTS "faqs" jsonb DEFAULT '[]'::jsonb NOT NULL;
