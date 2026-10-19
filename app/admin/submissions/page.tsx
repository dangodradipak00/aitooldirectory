import { desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { toolSubmissions } from '@/lib/db/schema';
import UserToolsTable from './UserToolsTable';

export default async function AdminSubmissionsPage() {
  const rows = await getDb().select().from(toolSubmissions).where(eq(toolSubmissions.paymentStatus, 'paid')).orderBy(desc(toolSubmissions.createdAt));
  return <UserToolsTable rows={rows.map((item) => ({
    id: item.id,
    toolName: item.toolName,
    website: item.website,
    submitterName: item.submitterName,
    submitterEmail: item.submitterEmail,
    paymentStatus: item.paymentStatus,
    paymentProvider: item.paymentProvider,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString()
  }))} />;
}
