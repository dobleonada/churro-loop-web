import { Fragment } from "react";
import type { ReactNode } from "react";

const BOLD = /\*\*(.+?)\*\*/g;

function renderInline(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of line.matchAll(BOLD)) {
    const start = match.index ?? 0;

    if (start > cursor) nodes.push(line.slice(cursor, start));
    nodes.push(
      <strong key={start} className="font-semibold">
        {match[1]}
      </strong>
    );
    cursor = start + match[0].length;
  }

  if (cursor < line.length) nodes.push(line.slice(cursor));

  return nodes;
}

interface MarkdownProps {
  source: string;
  className?: string;
}

/**
 * Renders the small Markdown subset Strapi's rich-text fields actually use:
 * blank-line paragraphs, hard line breaks and `**bold**`. That covers every
 * rich field in this project (`manifesto.text`, `loops.intro`,
 * `franchiseCta.text`), so it isn't worth a Markdown dependency.
 *
 * The line breaks are meaningful: the copy is written with deliberate breaks
 * that the design relies on, and longer lines still wrap naturally when the
 * container is narrower than the line.
 */
export function Markdown({ source, className }: MarkdownProps) {
  const paragraphs = source
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, paragraphIndex) => {
        const lines = paragraph.split("\n").map((line) => line.trim());

        return (
          <p key={paragraphIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {renderInline(line)}
                {lineIndex < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
