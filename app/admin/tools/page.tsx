import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { tools } from '@/lib/db/schema';
import AdminToolsTable from './AdminToolsTable';

export default async function AdminToolsPage() {
  const rows = await getDb().select().from(tools).orderBy(desc(tools.updatedAt));
  return <AdminToolsTable rows={rows.map((tool) => ({
    id: tool.id,
    name: tool.name,
    website: tool.website,
    logoUrl: tool.logoUrl,
    status: tool.status,
    createdAt: tool.createdAt.toISOString(),
    updatedAt: tool.updatedAt.toISOString()
  }))} />;
}
