import { desc } from 'drizzle-orm';
import AdminForm from '../AdminForm';
import { createBlog, setBlogStatus } from '../actions';
import { getDb } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import styles from '../admin.module.css';

export default async function AdminBlogsPage() {
  const posts = await getDb().select().from(blogPosts).orderBy(desc(blogPosts.updatedAt));
  return (
    <>
      <header className={styles.pageHeader}><div><p>Editorial</p><h1>Blog studio</h1><span>Draft, optimize and publish articles from one workspace.</span></div></header>
      <section className={styles.splitLayout}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}><div><p className={styles.kicker}>New article</p><h2>Write a blog post</h2></div></div>
          <AdminForm action={createBlog} submitLabel="Save article">
            <label>Title<input name="title" required /></label>
            <div className={styles.fieldRow}><label>Slug<input name="slug" placeholder="article-title" required /></label><label>Status<select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label></div>
            <label>Excerpt<textarea name="excerpt" rows={3} minLength={20} required /></label>
            <label>Article content<textarea name="content" rows={12} minLength={40} placeholder="Markdown content" required /></label>
            <label>Cover image URL<input name="coverImageUrl" type="url" placeholder="Optional until uploads are connected" /></label>
            <div className={styles.fieldRow}><label>SEO title<input name="seoTitle" maxLength={70} /></label><label>SEO description<textarea name="seoDescription" rows={2} maxLength={170} /></label></div>
          </AdminForm>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelTitle}><div><p className={styles.kicker}>{posts.length} articles</p><h2>Content library</h2></div></div>
          <div className={styles.recordList}>{posts.length ? posts.map((post) => <article className={styles.record} key={post.id}><div className={styles.recordIcon}>B</div><div><strong>{post.title}</strong><small>/{post.slug}/</small></div><span className={`${styles.status} ${styles[post.status]}`}>{post.status}</span><form action={setBlogStatus}><input name="id" type="hidden" value={post.id} /><select defaultValue={post.status} name="status" aria-label={`Status for ${post.title}`}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select><button type="submit">Update</button></form></article>) : <div className={styles.emptyState}><strong>No blog posts yet.</strong><p>Your first draft will appear here.</p></div>}</div>
        </div>
      </section>
    </>
  );
}
