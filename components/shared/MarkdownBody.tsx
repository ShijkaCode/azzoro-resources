import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownBody({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`prose prose-slate max-w-none prose-headings:font-semibold prose-p:text-foreground/90 ${className ?? ''}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}