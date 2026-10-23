import './globals.css';
import styles from './layout.module.css';
import { siteName, siteUrl } from '../lib/site';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FreemiumAITools — Software for Small Marketing Agencies',
    template: '%s | FreemiumAITools'
  },
  description: 'Research AI and agency software by workflow, pricing model and practical fit. Confirm current product details with each vendor.',
  applicationName: siteName,
  authors: [{ name: 'FreemiumAITools Editorial Team', url: '/authors/editorial-team/' }],
  creator: 'FreemiumAITools Editorial Team',
  publisher: siteName,
  openGraph: { siteName, type: 'website', locale: 'en_US' },
  twitter: { card: 'summary' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

const themeScript = `
  try {
    const savedTheme = localStorage.getItem('freemium-ai-tools-theme');
    const theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.currentScript.parentElement.dataset.theme = theme;
  } catch (_) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={styles.body} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
