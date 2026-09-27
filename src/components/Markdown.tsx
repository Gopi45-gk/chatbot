import React from 'react';

interface MarkdownProps {
  text: string;
  className?: string;
}

export default function Markdown({ text, className = '' }: MarkdownProps) {
  const renderLine = (line: string, key: number): React.ReactNode => {
    // Bold
    let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code
    processed = processed.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>');

    // Bullet points
    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      const content = processed.replace(/^[\s]*[•\-]\s*/, '');
      return (
        <div key={key} className="flex items-start gap-1.5 ml-1 my-0.5">
          <span className="text-blue-500 mt-0.5 text-xs">●</span>
          <span dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    // Numbered list
    if (/^\d+\.\s/.test(line.trim())) {
      const content = processed.replace(/^\d+\.\s*/, '');
      const num = line.trim().match(/^(\d+)\./)?.[1];
      return (
        <div key={key} className="flex items-start gap-1.5 ml-1 my-0.5">
          <span className="text-blue-500 font-bold text-xs min-w-[16px]">{num}.</span>
          <span dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    // Empty line
    if (line.trim() === '') {
      return <div key={key} className="h-2" />;
    }

    return (
      <div key={key} dangerouslySetInnerHTML={{ __html: processed }} />
    );
  };

  const lines = text.split('\n');

  return (
    <div className={`text-sm leading-relaxed ${className}`}>
      {lines.map((line, i) => renderLine(line, i))}
    </div>
  );
}
