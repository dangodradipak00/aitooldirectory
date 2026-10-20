import { cache } from 'react';
import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { dummyBlogs } from '@/data/dummy-blogs';

export const getPublishedBlogs = cache(async () => {
  try {
    const posts = await getDb().select().from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
    return posts.length > 0 ? posts : dummyBlogs;
  } catch {
    return dummyBlogs;
  }
});

export const getPublishedBlog = cache(async (slug: string) => {
  try {
    const [post] = await getDb().select().from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'published')))
      .limit(1);
    return post || dummyBlogs.find((item) => item.slug === slug) || null;
  } catch {
    return dummyBlogs.find((item) => item.slug === slug) || null;
  }
});
