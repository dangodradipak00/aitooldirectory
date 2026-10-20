import type { Tool } from '@/lib/db/schema';
import type { FormState } from '../actions';
import AdminForm from '../AdminForm';
import styles from '../admin.module.css';
import MarkdownEditor from './new/MarkdownEditor';
import SeoFields from './new/SeoFields';
import ToolCategoryFields from './new/ToolCategoryFields';
import ToolMediaFields from './new/ToolMediaFields';
import ToolStructuredContentFields from './new/ToolStructuredContentFields';
import ToolUseCasesAndFaqsFields from './new/ToolUseCasesAndFaqsFields';

type CategoryOption = { id: string; name: string };
type SubcategoryOption = CategoryOption & { parentCategoryId: string };
type LegacyDetails = {
  introduction?: string;
  audience?: string;
  workflow?: string[];
  pricingSummary?: string;
  pricingVerified?: string;
  features?: Array<{ name: string; description: string }>;
  editorialSummary?: string;
  pros?: string[];
  cons?: string[];
  useCases?: Array<{ name: string; description: string }>;
  faqs?: Array<{ question: string; answer: string }>;
};

const FieldHelp = ({ children }: { children: React.ReactNode }) => <small className={styles.fieldHelp}>{children}</small>;

function legacyMarkdown(tool: Tool, details?: LegacyDetails | null) {
  if (tool.contentMarkdown) return tool.contentMarkdown;
  if (!details) return '';
  const sections: string[] = [];
  if (details.introduction) sections.push(`## What is ${tool.name}?\n\n${details.introduction}`);
  if (details.audience) sections.push(`## Who should use ${tool.name}?\n\n${details.audience}`);
  if (details.workflow?.length) sections.push(`## How does ${tool.name} work?\n\n${details.workflow.map((step, index) => `${index + 1}. ${step}`).join('\n')}`);
  if (details.pricingSummary) sections.push(`## ${tool.name} pricing and plans\n\n${details.pricingSummary}${details.pricingVerified ? `\n\nPricing information checked: ${details.pricingVerified}` : ''}`);
  if (details.features?.length) sections.push(`## Key features\n\n${details.features.map((feature) => `### ${feature.name}\n\n${feature.description}`).join('\n\n')}`);
  if (details.editorialSummary) sections.push(`## Conclusion\n\n${details.editorialSummary}`);
  return sections.join('\n\n');
}

function socialValue(tool: Tool | null, network: string) {
  const value = tool?.socialLinks?.find((item) => item.network === network)?.url || '';
  return network === 'email' ? value.replace(/^mailto:/i, '') : value;
}

export default function ToolEditor({ action, categories, subcategories, tool = null, heading, submitLabel, contextLabel = 'Tools List', submissionMode = false, submissionCanPublish = false }: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  categories: CategoryOption[];
  subcategories: SubcategoryOption[];
  tool?: Tool | null;
  heading: string;
  submitLabel: string;
  contextLabel?: string;
  submissionMode?: boolean;
  submissionCanPublish?: boolean;
}) {
  const details = (tool?.details || null) as LegacyDetails | null;
  const pros = tool?.pros?.length ? tool.pros : details?.pros || [];
  const cons = tool?.cons?.length ? tool.cons : details?.cons || [];
  const useCases = tool?.useCases?.length ? tool.useCases : (details?.useCases || []).map((item) => ({ title: item.name, description: item.description }));
  const faqs = tool?.faqs?.length ? tool.faqs : details?.faqs || [];

  return <>
    <header className={styles.formPageHeader}><div><span>{contextLabel}</span><h1>{heading}</h1></div></header>
    <AdminForm action={action} submitLabel={submitLabel}>
      <div className={styles.toolFormLayout}>
        <div className={styles.toolFormMain}>
          <section className={styles.formCard}><h2>Tool Gallery</h2><ToolMediaFields logoUrl={tool?.logoUrl} websiteImageUrl={tool?.websiteImageUrl} /><FieldHelp>Upload a new image only when you want to replace the current one. Images are stored in Neon Object Storage.</FieldHelp></section>
          <section className={styles.formCard}><h2>Tool Information</h2><div className={styles.fieldRow}><label>Tool name *<input name="name" required defaultValue={tool?.name || ''} /></label><label>Slug *<input name="slug" placeholder="ahrefs" required defaultValue={tool?.slug || ''} /></label></div><label>Website URL *<input name="website" type="url" placeholder="https://" required defaultValue={tool?.website || ''} /></label><ToolCategoryFields categories={categories} subcategories={subcategories} initialPrimaryCategoryId={tool?.primaryCategoryId || ''} initialSubcategoryIds={tool?.subcategoryIds || []} /></section>
          <section className={styles.formCard}><h2>Hero Content</h2><label>Short description *<textarea name="summary" rows={4} minLength={20} maxLength={500} required placeholder="Write a concise description for the tool page hero section." defaultValue={tool?.summary || ''} /></label><FieldHelp>This description appears only in the hero and directory cards. Keep it short and clear.</FieldHelp></section>
          <MarkdownEditor initialValue={tool ? legacyMarkdown(tool, details) : ''} />
          <ToolStructuredContentFields pros={pros} cons={cons} />
          <ToolUseCasesAndFaqsFields useCases={useCases} faqs={faqs} />
        </div>
        <aside className={styles.toolFormAside}>
          {submissionMode ? <section className={styles.formCard}><h2>User Tool status</h2><p className={styles.submissionModeNote}>This entry always stays in User Tools and never moves into Admin Tools.</p>{submissionCanPublish ? <label>Website visibility<select name="publicationStatus" defaultValue={tool?.status || 'draft'}><option value="draft">Draft / Offline</option><option value="published">Live</option><option value="archived">Archived</option></select></label> : <p className={styles.submissionModeNote}>Approve the request first to enable public visibility.</p>}</section> : <section className={styles.formCard}><h2>Publish</h2><label>Status<select name="status" defaultValue={tool?.status || 'draft'}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><div className={styles.checkGrid}><label><input name="verified" type="checkbox" defaultChecked={tool?.verified || false} /> Verified</label></div></section>}
          <section className={`${styles.formCard} ${styles.pricingTagCard}`}><h2>Pricing Tag *</h2><div className={styles.pricingOptions}>{(['Free', 'Freemium', 'Paid'] as const).map((pricing) => <label key={pricing}><input name="pricing" type="radio" value={pricing} required defaultChecked={(tool?.pricing || '') === pricing} /><span>{pricing}</span></label>)}</div><FieldHelp>The selected value appears as the pricing tag below the tool name.</FieldHelp></section>
          {!submissionMode && <section className={`${styles.formCard} ${styles.followCard}`}><h2>Main Website URL Follow *</h2><div className={styles.followOptions}><label><input name="followLink" type="radio" value="dofollow" required defaultChecked={tool?.followLink === true} /><span><strong>Do-follow</strong><small>Allow search engines to follow the vendor link</small></span></label><label><input name="followLink" type="radio" value="nofollow" required defaultChecked={!tool?.followLink} /><span><strong>No-follow</strong><small>Do not pass ranking signals to the vendor URL</small></span></label></div><FieldHelp>This setting applies to the main Visit this site URL and other vendor links only.</FieldHelp></section>}
          <SeoFields initialTitle={tool?.seoTitle} initialDescription={tool?.seoDescription} />
          <section className={styles.formCard}><h2>Social &amp; Support</h2><label>X / Twitter URL<input name="xUrl" type="url" defaultValue={socialValue(tool, 'x')} /></label><label>Facebook URL<input name="facebookUrl" type="url" defaultValue={socialValue(tool, 'facebook')} /></label><label>YouTube URL<input name="youtubeUrl" type="url" defaultValue={socialValue(tool, 'youtube')} /></label><label>LinkedIn URL<input name="linkedinUrl" type="url" defaultValue={socialValue(tool, 'linkedin')} /></label><label>Support email<input name="supportEmail" type="email" defaultValue={socialValue(tool, 'email')} /></label></section>
        </aside>
      </div>
    </AdminForm>
  </>;
}
