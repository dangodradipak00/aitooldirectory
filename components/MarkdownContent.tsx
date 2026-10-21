import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ReactNode } from 'react';
import { uniqueMarkdownHeadingId } from '@/lib/markdown-headings';

function nodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return nodeText((node.props as { children?: ReactNode }).children);
  }
  return '';
}

export default function MarkdownContent({ content, className }: { content: string; className?: string }) {
  const headingCounts = new Map<string, number>();
  const headingId = (children: ReactNode) => uniqueMarkdownHeadingId(nodeText(children), headingCounts);

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
          h3: ({ children }) => <h3 id={headingId(children)}>{children}</h3>,
          a: ({ href, title, children }) => {
            const external = href?.startsWith('http://') || href?.startsWith('https://');
            const marker = title?.trim().toLowerCase();
            const seoMarker = marker === 'dofollow' || marker === 'nofollow';
            const rel = [marker === 'nofollow' ? 'nofollow' : '', external ? 'noopener noreferrer' : ''].filter(Boolean).join(' ') || undefined;
            return <a href={href} target={external ? '_blank' : undefined} rel={rel} title={seoMarker ? undefined : title}>{children}</a>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
