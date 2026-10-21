import { eq, or } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { updateBlog } from '../../../actions';
import BlogEditor from '../../BlogEditor';

export default async function EditBlogPage({ params }: PageProps<'/admin/blogs/[slug]/edit'>) {
  const { slug } = await params;
  const isLegacyId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
  const [post] = await getDb()
    .select()
    .from(blogPosts)
    .where(isLegacyId ? or(eq(blogPosts.slug, slug), eq(blogPosts.id, slug)) : eq(blogPosts.slug, slug))
    .limit(1);

  if (!post) notFound();

  // Keep old bookmarked UUID routes working, but normalize them to the readable URL.
  if (slug !== post.slug) redirect(`/admin/blogs/${post.slug}/edit/`);

  return <BlogEditor action={updateBlog.bind(null, post.id)} post={post} heading={post.title} submitLabel="Update blog" />;
}
