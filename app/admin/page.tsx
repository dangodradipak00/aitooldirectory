import { count, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { blogPosts, tools, toolSubmissions } from '@/lib/db/schema';
import styles from './admin.module.css';

export default async function AdminDashboard() {
  const db = getDb();
  const [[toolTotal], [pendingTotal], [blogTotal], [publishedTotal]] = await Promise.all([
    db.select({ value: count() }).from(tools),
    db.select({ value: count() }).from(toolSubmissions).where(eq(toolSubmissions.status, 'pending')),
    db.select({ value: count() }).from(blogPosts),
    db.select({ value: count() }).from(tools).where(eq(tools.status, 'published'))
  ]);
  return (
    <>
      <header className={styles.pageHeader}><div><p>Workspace overview</p><h1>Everything that needs attention.</h1></div><span className={styles.liveBadge}>Production database</span></header>
      <section className={styles.statGrid}>
        <article><span>All tools</span><strong>{toolTotal.value}</strong><small>{publishedTotal.value} published</small></article>
        <article><span>Pending submissions</span><strong>{pendingTotal.value}</strong><small>Review queue</small></article>
        <article><span>Blog posts</span><strong>{blogTotal.value}</strong><small>Drafts and published</small></article>
        <article className={styles.accentStat}><span>System</span><strong>Live</strong><small>Neon Singapore</small></article>
      </section>
      <section className={styles.welcomePanel}><div><p className={styles.kicker}>Recommended workflow</p><h2>Review first, publish deliberately.</h2><p>User submissions land in a private queue. Approving one creates a draft tool, so nothing becomes public without a final admin review.</p></div><ol><li><span>01</span>Review submission details</li><li><span>02</span>Approve into a draft</li><li><span>03</span>Complete editorial content</li><li><span>04</span>Publish when ready</li></ol></section>
    </>
  );
}
