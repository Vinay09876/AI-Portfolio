import React from 'react';

interface MarkdownProps {
  content: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  // Split content by paragraphs or blocks
  const blocks = content.split('\n');

  let inList = false;
  const listItems: string[] = [];
  const renderedElements: React.ReactNode[] = [];

  const parseInlineStyles = (text: string): string => {
    let html = text;

    // Bold-italic: ***text***
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');

    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Inline Code: `code`
    html = html.replace(
      /`(.*?)`/g,
      '<code class="font-mono text-rose-600 dark:text-rose-400 bg-slate-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded text-xs font-semibold">$1</code>'
    );

    // Bare URLs not already wrapped in [text](url) syntax — auto-link them too
    html = html.replace(
      /(?<!\]\()(https?:\/\/[^\s<)]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-teal-600 dark:text-teal-400 hover:underline font-medium break-all">$1</a>'
    );

    // Links: [text](url)
    html = html.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-teal-600 dark:text-teal-400 hover:underline font-medium inline-flex items-center gap-0.5">$1</a>'
    );

    return html;
  };

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="list-disc pl-6 my-2 space-y-1.5 text-slate-700 dark:text-zinc-300">
          {listItems.map((item, idx) => (
            <li
              key={`li-${key}-${idx}`}
              dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }}
            />
          ))}
        </ul>
      );
      listItems.length = 0; // Clear the list items
    }
    inList = false;
  };

  blocks.forEach((line, index) => {
    const trimmed = line.trim();
    const key = `block-${index}`;

    // 1. Horizontal Rule
    if (trimmed === '---') {
      flushList(key);
      renderedElements.push(
        <hr key={key} className="my-5 border-slate-200 dark:border-zinc-800" />
      );
    }
    // 2. Headers: ###
    else if (trimmed.startsWith('### ')) {
      flushList(key);
      const title = trimmed.replace('### ', '');
      renderedElements.push(
        <h4
          key={key}
          className="text-lg font-bold text-slate-900 dark:text-zinc-50 mt-4 mb-2 first:mt-0 tracking-tight"
          dangerouslySetInnerHTML={{ __html: parseInlineStyles(title) }}
        />
      );
    }
    // 3. Headers: ##
    else if (trimmed.startsWith('## ')) {
      flushList(key);
      const title = trimmed.replace('## ', '');
      renderedElements.push(
        <h3
          key={key}
          className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 mt-6 mb-3 first:mt-0 tracking-tight"
          dangerouslySetInnerHTML={{ __html: parseInlineStyles(title) }}
        />
      );
    }
    // 4. Bullet lists: * or -
    else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      inList = true;
      const content = trimmed.substring(2);
      listItems.push(content);
    }
    // 5. Numbered lists: e.g. 1.
    else if (/^\d+\.\s/.test(trimmed)) {
      flushList(key);
      const match = trimmed.match(/^(\d+)\.\s(.*)/);
      if (match) {
        const num = match[1];
        const content = match[2];
        renderedElements.push(
          <div key={key} className="flex gap-2.5 my-2.5 pl-2 text-slate-700 dark:text-zinc-300">
            <span className="font-bold text-teal-600 dark:text-teal-400 min-w-[1.25rem] text-right">{num}.</span>
            <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(content) }} />
          </div>
        );
      }
    }
    // 6. Empty Line
    else if (trimmed === '') {
      flushList(key);
    }
    // 7. Standard Paragraph
    else {
      flushList(key);
      renderedElements.push(
        <p
          key={key}
          className="text-slate-700 dark:text-zinc-300 leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: parseInlineStyles(trimmed) }}
        />
      );
    }
  });

  // Flush any remaining list items
  flushList('final');

  return <div className="space-y-1.5 break-words">{renderedElements}</div>;
};
