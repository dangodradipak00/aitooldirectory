import AdminForm from '../../AdminForm';
import { createTool } from '../../actions';
import { getDb } from '@/lib/db';
import { categories, subcategories } from '@/lib/db/schema';
import styles from '../../admin.module.css';
import ToolCategoryFields from './ToolCategoryFields';

const FieldHelp = ({ children }: { children: React.ReactNode }) => <small className={styles.fieldHelp}>{children}</small>;

export default async function AddNewAiToolPage() {
  const db = getDb();
  const [categoryRows, subcategoryRows] = await Promise.all([
    db.select().from(categories).orderBy(categories.name),
    db.select().from(subcategories).orderBy(subcategories.name)
  ]);

  return <>
    <header className={styles.formPageHeader}><div><span>Tools List</span><h1>Add New AI Tool</h1></div></header>
    <AdminForm action={createTool} submitLabel="Save AI Tool">
      <div className={styles.toolFormLayout}>
        <div className={styles.toolFormMain}>
          <section className={styles.formCard}><h2>Tool Gallery</h2><div className={styles.fieldRow}><label>Tool logo URL<input name="logoUrl" type="url" placeholder="https://.../logo.png" /></label><label>Tool website image URL<input name="websiteImageUrl" type="url" placeholder="https://.../screenshot.png" /></label></div><FieldHelp>Neon Object Storage upload will be connected later; currently use public image URLs.</FieldHelp></section>
          <section className={styles.formCard}><h2>Tool Information</h2><div className={styles.fieldRow}><label>Tool name *<input name="name" required /></label><label>Slug *<input name="slug" placeholder="ahrefs" required /></label></div><label>Website URL *<input name="website" type="url" placeholder="https://" required /></label><ToolCategoryFields categories={categoryRows.map(({ id, name }) => ({ id, name }))} subcategories={subcategoryRows.map(({ id, name, parentCategoryId }) => ({ id, name, parentCategoryId }))} /></section>
          <section className={styles.formCard}><h2>Directory Summary</h2><label>Short summary *<textarea name="summary" rows={4} minLength={20} required /></label><label>Best for<textarea name="bestFor" rows={3} /></label><label>Highlights<textarea name="highlights" rows={4} placeholder={'Keyword research\nBacklink analysis\nSite auditing'} /></label><FieldHelp>Enter one highlight per line.</FieldHelp></section>
          <section className={styles.formCard}><h2>Detailed Overview</h2><label>Introduction<textarea name="introduction" rows={6} /></label><label>Audience<textarea name="audience" rows={4} /></label><label>Features<textarea name="features" rows={8} placeholder={'Site Explorer | Research organic performance and backlinks.\nSite Audit | Find technical SEO issues.'} /></label><label>Workflow steps<textarea name="workflow" rows={6} placeholder={'Create a project.\nRun the initial audit.\nTrack priority keywords.'} /></label><FieldHelp>Features use “Name | Description”. Workflow uses one step per line.</FieldHelp></section>
          <section className={styles.formCard}><h2>Editorial Content</h2><div className={styles.fieldRow}><label>Pros<textarea name="pros" rows={7} placeholder="One item per line" /></label><label>Cons<textarea name="cons" rows={7} placeholder="One item per line" /></label></div><label>Use cases<textarea name="useCases" rows={7} placeholder="Competitor research | Compare competing domains and pages." /></label><label>Editorial summary<textarea name="editorialSummary" rows={6} /></label><label>FAQs<textarea name="faqs" rows={8} placeholder="What is this tool used for? | Add the complete answer here." /></label><FieldHelp>Use cases and FAQs use “Title/Question | Description/Answer”.</FieldHelp></section>
        </div>
        <aside className={styles.toolFormAside}>
          <section className={styles.formCard}><h2>Publish</h2><label>Status<select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><div className={styles.checkGrid}><label><input name="verified" type="checkbox" /> Verified</label><label><input name="featured" type="checkbox" /> Featured</label><label><input name="affiliate" type="checkbox" /> Affiliate</label><label><input name="followLink" type="checkbox" /> Do-follow link</label></div></section>
          <section className={styles.formCard}><h2>Pricing</h2><label>Pricing label *<input name="pricing" defaultValue="Contact vendor" required /></label><label>Starting price<input name="startingPrice" placeholder="€27/month for Starter" /></label><label>Free option<input name="freeOption" placeholder="Free limited access" /></label><label>Pricing checked date<input name="pricingVerified" placeholder="18 October 2026" /></label><label>Pricing summary<textarea name="pricingSummary" rows={7} /></label></section>
          <section className={styles.formCard}><h2>SEO</h2><label>SEO title<input name="seoTitle" maxLength={70} /></label><label>SEO description<textarea name="seoDescription" rows={5} maxLength={170} /></label><label>Meta keywords<input name="metaKeywords" placeholder="seo, keyword research, backlinks" /></label></section>
          <section className={styles.formCard}><h2>Social & Support</h2><label>X / Twitter URL<input name="xUrl" type="url" /></label><label>Facebook URL<input name="facebookUrl" type="url" /></label><label>YouTube URL<input name="youtubeUrl" type="url" /></label><label>LinkedIn URL<input name="linkedinUrl" type="url" /></label><label>Support email<input name="supportEmail" type="email" /></label></section>
        </aside>
      </div>
    </AdminForm>
  </>;
}
