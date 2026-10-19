'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOutAdmin } from './actions';
import styles from './admin.module.css';

const pageItems = [
  { href: '/admin/', label: 'Dashboard', icon: 'grid' },
  { href: '/admin/categories/', label: 'Category', icon: 'category' },
  { href: '/admin/subcategories/', label: 'Sub Category', icon: 'category' },
  { href: '/admin/tools/new/', label: 'Add New AI Tool', icon: 'tool' },
  { href: '/admin/tools/', label: 'Admin Tools', icon: 'tool' },
  { href: '/admin/submissions/', label: 'User Tools', icon: 'inbox' },
  { href: '/admin/blogs/', label: 'Blogs', icon: 'document' },
] as const;

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    inbox: <><path d="M4 5h16l-2 13H6L4 5Z"/><path d="M6 14h4l2 2 2-2h4"/></>,
    tool: <><path d="m14.7 6.3 3-3a5 5 0 0 1-6.4 6.4L5.6 15.4a2 2 0 0 0 3 3l5.7-5.7a5 5 0 0 1 6.4-6.4l-3 3"/></>,
    document: <><path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></>,
    category: <><circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6H5V6h6"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    chevron: <path d="m9 7 5 5-5 5"/>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h7v18h-7"/></>
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function isCurrent(pathname: string, href: string) {
  return href === '/admin/' ? pathname === '/admin' || pathname === '/admin/' : pathname.startsWith(href);
}

export default function AdminChrome({ user, children }: {
  user: { name?: string | null; email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(pathname.includes('/categories') || pathname.includes('/subcategories'));
  const [toolsOpen, setToolsOpen] = useState(pathname.includes('/tools') || pathname.includes('/submissions'));
  const active = pageItems.find((item) => isCurrent(pathname, item.href)) ?? pageItems[0];
  const initials = (user.name || user.email).split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={styles.adminShell}>
      <button className={`${styles.sidebarBackdrop} ${open ? styles.backdropVisible : ''}`} aria-label="Close navigation" onClick={() => setOpen(false)} />
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHead}>
          <Link className={styles.adminBrand} href="/admin/" onClick={() => setOpen(false)}><span>A</span><strong>AgencyToolGuide</strong><small>Admin workspace</small></Link>
          <button className={styles.sidebarClose} type="button" aria-label="Close menu" onClick={() => setOpen(false)}><Icon name="close" /></button>
        </div>
        <p className={styles.navLabel}>Workspace</p>
        <nav aria-label="Admin navigation">
          <Link href="/admin/" className={isCurrent(pathname, '/admin/') ? styles.activeNav : ''} onClick={() => setOpen(false)}><Icon name="grid" /><span>Dashboard</span></Link>
          <div className={styles.navGroup}>
            <button type="button" className={(pathname.includes('/categories') || pathname.includes('/subcategories')) ? styles.activeGroup : ''} onClick={() => setCategoryOpen((value) => !value)} aria-expanded={categoryOpen}>
              <Icon name="category" /><span>Tool Category</span><i className={categoryOpen ? styles.chevronOpen : ''}><Icon name="chevron" /></i>
            </button>
            <div className={`${styles.subNav} ${categoryOpen ? styles.subNavOpen : ''}`}>
              <Link href="/admin/categories/" className={isCurrent(pathname, '/admin/categories/') ? styles.activeSubNav : ''} onClick={() => setOpen(false)}>Category</Link>
              <Link href="/admin/subcategories/" className={isCurrent(pathname, '/admin/subcategories/') ? styles.activeSubNav : ''} onClick={() => setOpen(false)}>Sub Category</Link>
            </div>
          </div>
          <div className={styles.navGroup}>
            <button type="button" className={(pathname.includes('/tools') || pathname.includes('/submissions')) ? styles.activeGroup : ''} onClick={() => setToolsOpen((value) => !value)} aria-expanded={toolsOpen}>
              <Icon name="tool" /><span>Tools List</span><i className={toolsOpen ? styles.chevronOpen : ''}><Icon name="chevron" /></i>
            </button>
            <div className={`${styles.subNav} ${toolsOpen ? styles.subNavOpen : ''}`}>
              <Link href="/admin/tools/" className={(pathname === '/admin/tools' || pathname === '/admin/tools/') ? styles.activeSubNav : ''} onClick={() => setOpen(false)}>Admin Tools</Link>
              <Link href="/admin/submissions/" className={isCurrent(pathname, '/admin/submissions/') ? styles.activeSubNav : ''} onClick={() => setOpen(false)}>User Tools</Link>
              <Link href="/admin/tools/new/" className={isCurrent(pathname, '/admin/tools/new/') ? styles.activeSubNav : ''} onClick={() => setOpen(false)}>Add New AI Tool</Link>
            </div>
          </div>
          <Link href="/admin/blogs/" className={isCurrent(pathname, '/admin/blogs/') ? styles.activeNav : ''} onClick={() => setOpen(false)}><Icon name="document" /><span>Blogs</span></Link>
        </nav>
        <p className={styles.navLabel}>Website</p>
        <nav aria-label="Website links"><Link href="/" target="_blank"><Icon name="external" /><span>View website</span></Link></nav>
        <div className={styles.profile}>
          <span className={styles.avatar}>{initials}</span>
          <div><strong>{user.name || 'Admin'}</strong><small>{user.email}</small></div>
          <form action={signOutAdmin}><button type="submit" aria-label="Sign out"><Icon name="logout" /></button></form>
        </div>
      </aside>
      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div><button className={styles.menuButton} type="button" aria-label="Open navigation" onClick={() => setOpen(true)}><Icon name="menu" /></button><span className={styles.topbarTitle}>{active.label}</span></div>
          <div className={styles.topbarUser}><span className={styles.topbarStatus}><i /> System online</span><span className={styles.avatar}>{initials}</span><div><strong>{user.name || 'Admin'}</strong><small>Administrator</small></div></div>
        </header>
        <main className={styles.adminMain}>{children}</main>
      </div>
    </div>
  );
}
