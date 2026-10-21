import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import BlogTable from './BlogTable';

export default async function AdminBlogsPage() {
  const posts = await getDb().select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  return <BlogTable rows={posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    publishedAt: post.publishedAt?.toISOString() || null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  }))} />;
}
