import { redirect } from 'next/navigation';
import { auth } from './server';

type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string | string[] | null;
};

function configuredAdminEmails() {
  return (process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: SessionUser) {
  const roles = Array.isArray(user.role) ? user.role : user.role ? [user.role] : [];
  return roles.includes('admin') || configuredAdminEmails().includes(user.email.toLowerCase());
}

export async function getAdminSession() {
  const { data } = await auth.getSession();
  const user = data?.user as SessionUser | undefined;
  return user && isAdminUser(user) ? { ...data, user } : null;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect('/login/admin/');
  return session;
}

export async function assertAdmin() {
  const { data } = await auth.getSession();
  const user = data?.user as SessionUser | undefined;
  if (!user || !isAdminUser(user)) throw new Error('Unauthorized');
  return user;
}
