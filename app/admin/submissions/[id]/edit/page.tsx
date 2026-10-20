import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { categories, subcategories, tools, toolSubmissions, type Tool } from '@/lib/db/schema';
import { updateSubmission } from '../../../actions';
import ToolEditor from '../../../tools/ToolEditor';

export default async function EditSubmissionPage({ params }: PageProps<'/admin/submissions/[id]/edit'>) {
  const { id } = await params;
  const db = getDb();
  const [[submissionResult], categoryRows, subcategoryRows] = await Promise.all([
    db.select({ submission: toolSubmissions, publicationStatus: tools.status })
      .from(toolSubmissions)
      .leftJoin(tools, eq(toolSubmissions.promotedToolId, tools.id))
      .where(eq(toolSubmissions.id, id))
      .limit(1),
    db.select().from(categories).orderBy(categories.name),
    db.select().from(subcategories).orderBy(subcategories.name)
  ]);
  const submission = submissionResult?.submission;
  if (!submission) notFound();

  const editorTool: Tool = {
    id: submission.id,
    slug: submission.slug || submission.toolName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90),
    name: submission.toolName,
    website: submission.website,
    summary: submission.description,
    bestFor: '',
    pricing: submission.pricing,
    logoUrl: submission.logoUrl,
    websiteImageUrl: submission.websiteImageUrl,
    contentMarkdown: submission.contentMarkdown,
    conclusion: null,
    pros: submission.pros,
    cons: submission.cons,
    features: [],
    useCases: submission.useCases,
    faqs: submission.faqs,
    primaryCategoryId: submission.primaryCategoryId,
    secondaryCategoryIds: [],
    subcategoryIds: submission.subcategoryIds,
    highlights: [],
    details: null,
    socialLinks: submission.socialLinks,
    seoTitle: submission.seoTitle,
    seoDescription: submission.seoDescription,
    metaKeywords: null,
    verified: false,
    affiliate: false,
    followLink: false,
    status: submissionResult.publicationStatus || 'draft',
    featured: false,
    submittedByAuthId: submission.submittedByAuthId,
    publishedAt: null,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt
  };

  return <ToolEditor
    action={updateSubmission.bind(null, submission.id)}
    categories={categoryRows.map(({ id: categoryId, name }) => ({ id: categoryId, name }))}
    subcategories={subcategoryRows.map(({ id: subcategoryId, name, parentCategoryId }) => ({ id: subcategoryId, name, parentCategoryId }))}
    tool={editorTool}
    heading={`Edit ${submission.toolName}`}
    submitLabel="Update User Submission"
    contextLabel="User Tools"
    submissionMode
    submissionCanPublish={Boolean(submissionResult.publicationStatus)}
  />;
}
