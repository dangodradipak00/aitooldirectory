import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownContent({ content, className }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
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
