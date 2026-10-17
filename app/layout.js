import styles from './layout.module.css';

export const metadata = {
  title: {
    default: 'AgencyToolGuide — Software for Small Marketing Agencies',
    template: '%s | AgencyToolGuide'
  },
  description: 'Explore reporting, SEO and call tracking software for small marketing agencies.',
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

const themeScript = `
  try {
    const savedTheme = localStorage.getItem('agency-tool-guide-theme');
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
