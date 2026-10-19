import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import AdminForm from '@/app/admin/AdminForm';
import { signInAdmin } from '@/app/admin/actions';
import styles from '@/app/admin/admin.module.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin sign in', robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect('/admin/');
  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <Link className={styles.loginBrand} href="/"><span>A</span>AgencyToolGuide</Link>
        <p className={styles.kicker}>Private workspace</p>
        <h1>Welcome back.</h1>
        <p>Sign in with the admin account you created in Neon.</p>
        <AdminForm action={signInAdmin} submitLabel="Sign in to admin">
          <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>
        </AdminForm>
        <Link className={styles.backLink} href="/">← Back to website</Link>
      </section>
      <aside className={styles.loginVisual} aria-hidden="true"><div><span>Submission</span><i>Review</i><strong>Published</strong></div></aside>
    </main>
  );
}
