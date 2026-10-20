import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { toolSubmissions } from '@/lib/db/schema';
import UserToolsTable from './UserToolsTable';

export default async function AdminSubmissionsPage() {
  const rows = await getDb().select({
    id: toolSubmissions.id,
    toolName: toolSubmissions.toolName,
    logoUrl: toolSubmissions.logoUrl,
    website: toolSubmissions.website,
    submitterName: toolSubmissions.submitterName,
    submitterEmail: toolSubmissions.submitterEmail,
    paymentStatus: toolSubmissions.paymentStatus,
    paymentProvider: toolSubmissions.paymentProvider,
    promotedToolId: toolSubmissions.promotedToolId,
    status: toolSubmissions.status,
    createdAt: toolSubmissions.createdAt,
    updatedAt: toolSubmissions.updatedAt
  }).from(toolSubmissions).orderBy(desc(toolSubmissions.createdAt));
  return <UserToolsTable rows={rows.map((item) => ({
    id: item.id,
    toolName: item.toolName,
    logoUrl: item.logoUrl,
    website: item.website,
    submitterName: item.submitterName,
    submitterEmail: item.submitterEmail,
    paymentStatus: item.paymentStatus,
    paymentProvider: item.paymentProvider,
    promotedToolId: item.promotedToolId,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString()
  }))} />;
}
