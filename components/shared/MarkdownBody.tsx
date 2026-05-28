import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownBody({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={[
        'prose max-w-none',
        // headings — display serif, tight
        'prose-headings:font-display prose-headings:font-medium prose-headings:tracking-[-0.01em] prose-headings:text-ink',
        'prose-h2:text-3xl prose-h2:leading-tight prose-h2:mt-14 prose-h2:mb-5',
        'prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4',
        // body
        'prose-p:text-ink/80 prose-p:leading-relaxed prose-li:text-ink/80 prose-li:leading-relaxed',
        'prose-strong:text-ink prose-strong:font-medium',
        'prose-a:text-ink prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-ink/70',
        // tables — hairline grid, tabular figures
        'prose-table:text-[14px] prose-table:border prose-table:border-rule',
        'prose-thead:border-b prose-thead:border-rule',
        'prose-th:bg-paper prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-[11px] prose-th:font-medium prose-th:uppercase prose-th:tracking-[0.2em] prose-th:text-muted-ink',
        'prose-td:border-t prose-td:border-rule prose-td:px-4 prose-td:py-3 prose-td:align-top',
        // hr
        'prose-hr:border-rule',
        className ?? '',
      ].join(' ')}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
