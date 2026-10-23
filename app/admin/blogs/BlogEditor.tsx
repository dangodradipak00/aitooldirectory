import Link from 'next/link';
import type { BlogPost } from '@/lib/db/schema';
import AdminForm from '../AdminForm';
import type { FormState } from '../actions';
import MarkdownEditor from '../tools/new/MarkdownEditor';
import SeoFields from '../tools/new/SeoFields';
import { PairEditor } from '../tools/new/ToolUseCasesAndFaqsFields';
import { BlogBasicsFields, BlogCoverField } from './BlogBasicsFields';
import styles from '../admin.module.css';

const BLOG_TEMPLATE = `Open with a short introduction that tells readers what they will learn and why it matters.

## First main section

Explain the first idea with practical details and examples.

## Second main section

Continue the guide with clear recommendations readers can apply.

### Helpful detail

Use H3 headings when a section needs a smaller subsection.

## Final takeaway

Summarize the most useful points and give the reader a clear next step.`;

function formatDate(value?: Date | null) {
  if (!value) return 'Not published';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(value);
}

export default function BlogEditor({ action, post = null, heading, submitLabel }: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  post?: BlogPost | null;
  heading: string;
  submitLabel: string;
}) {
  return <>
    <header className={`${styles.formPageHeader} ${styles.blogFormHeader}`}>
      <div><span>Blog studio</span><h1>{heading}</h1></div>
      <div className={styles.formHeaderActions}>
        <Link href="/admin/blogs/">Back to blogs</Link>
        {post?.status === 'published' ? <Link href={`/blog/${post.slug}/`} target="_blank">View live article</Link> : null}
      </div>
    </header>
    <AdminForm action={action} submitLabel={submitLabel}>
      <div className={`${styles.toolFormLayout} ${styles.blogFormLayout}`}>
        <div className={styles.toolFormMain}>
          <section className={styles.formCard}><h2>Article details</h2><BlogBasicsFields title={post?.title} slug={post?.slug} /></section>
          <section className={styles.formCard}><h2>Cover image</h2><BlogCoverField initialUrl={post?.coverImageUrl} /><small className={styles.fieldHelp}>Uploaded images are stored in Neon Object Storage and served through the website media route.</small></section>
          <MarkdownEditor
            initialValue={post?.content || ''}
            fieldName="content"
            heading="Article content"
            description="Write the complete blog article in Markdown. H2 and H3 headings automatically build the public table of contents."
            template={BLOG_TEMPLATE}
            minLength={40}
            placeholder="Write the article here, or insert the article template..."
            allowImageUpload
          />
          <PairEditor
            title="Frequently Asked Questions"
            addLabel="Add FAQ"
            firstName="faqQuestions"
            firstLabel="Question"
            firstPlaceholder="e.g. How does this work?"
            secondName="faqAnswers"
            secondLabel="Answer"
            secondPlaceholder="Write a clear and useful answer."
            initialItems={(post?.faqs || []).map((item) => ({ first: item.question, second: item.answer }))}
          />
        </div>
        <aside className={styles.toolFormAside}>
          <section className={styles.formCard}><h2>Publish</h2><label>Status<select name="status" defaultValue={post?.status || 'draft'}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><div className={styles.blogPublishSummary}><span>Published</span><strong>{formatDate(post?.publishedAt)}</strong><span>Last updated</span><strong>{post ? formatDate(post.updatedAt) : 'New article'}</strong></div></section>
          <SeoFields initialTitle={post?.seoTitle} initialDescription={post?.seoDescription} />
          <section className={styles.formCard}><h2>Author</h2><p className={styles.submissionModeNote}>Articles are published under the FreemiumAITools Editorial Team profile.</p></section>
        </aside>
      </div>
    </AdminForm>
  </>;
}
