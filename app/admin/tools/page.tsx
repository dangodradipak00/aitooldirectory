import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { tools, toolSubmissions } from '@/lib/db/schema';
import AdminToolsTable from './AdminToolsTable';

export default async function AdminToolsPage() {
  const db = getDb();
  const [rows, submissionLinks] = await Promise.all([
    db.select({
      id: tools.id,
      name: tools.name,
      website: tools.website,
      logoUrl: tools.logoUrl,
      status: tools.status,
      createdAt: tools.createdAt,
      updatedAt: tools.updatedAt
    }).from(tools).orderBy(desc(tools.updatedAt)),
    db.select({ promotedToolId: toolSubmissions.promotedToolId }).from(toolSubmissions)
  ]);
  const userToolIds = new Set(submissionLinks.map((item) => item.promotedToolId).filter(Boolean));
  return <AdminToolsTable rows={rows.filter((tool) => !userToolIds.has(tool.id)).map((tool) => ({
    id: tool.id,
    name: tool.name,
    website: tool.website,
    logoUrl: tool.logoUrl,
    status: tool.status,
    createdAt: tool.createdAt.toISOString(),
    updatedAt: tool.updatedAt.toISOString()
  }))} />;
}
