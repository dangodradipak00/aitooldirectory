import { cache } from 'react';
import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';

export const getPublishedBlogs = cache(async () => {
  try {
    return await getDb().select().from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
  } catch {
    return [];
  }
});

export const getPublishedBlog = cache(async (slug: string) => {
  try {
    const [post] = await getDb().select().from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'published')))
      .limit(1);
    return post || null;
  } catch {
    return null;
  }
});
