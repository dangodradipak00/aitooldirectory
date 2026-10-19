import { requireAdmin } from '@/lib/auth/admin';
import AdminChrome from './AdminChrome';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <AdminChrome user={{ name: session.user.name, email: session.user.email }}>{children}</AdminChrome>;
}
