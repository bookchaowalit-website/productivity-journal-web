// A small markdown renderer for the journal files: headings, paragraphs, bullet and numbered lists,
// **bold** and *italic*. It builds React elements, so text is always escaped and raw HTML is never injected.
import type { ReactNode } from "react";

export type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

const HEADING = /^(#{1,6})\s+(.*)$/;
const BULLET = /^[-*+]\s+(.*)$/;
const NUMBERED = /^\d+[.)]\s+(.*)$/;

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    const heading = HEADING.exec(line);
    const bullet = BULLET.exec(line);
    const numbered = bullet ? null : NUMBERED.exec(line);
    if (!line) {
      flush();
    } else if (heading) {
      flush();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2].trim() });
    } else if (bullet || numbered) {
      flush();
      const ordered = Boolean(numbered);
      const item = (bullet ?? numbered)![1].trim();
      const last = blocks.at(-1);
      if (last?.type === "list" && last.ordered === ordered) last.items.push(item);
      else blocks.push({ type: "list", ordered, items: [item] });
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

/** **bold** and *italic* to <strong>/<em>; everything else stays plain (escaped) text. */
export function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

/**
 * Renders the body under a page that already shows the title as its h1: a leading heading equal to
 * `dropTitle` is skipped, and the remaining headings start at h2.
 */
export function renderMarkdown(source: string, options: { dropTitle?: string } = {}): ReactNode[] {
  let blocks = parseMarkdown(source);
  const first = blocks[0];
  if (options.dropTitle && first?.type === "heading" && first.text === options.dropTitle) blocks = blocks.slice(1);
  return blocks.map((block, index) => {
    if (block.type === "heading") {
      const Tag = (`h${Math.min(Math.max(block.level, 2), 6)}`) as "h2" | "h3" | "h4" | "h5" | "h6";
      return <Tag key={index}>{renderInline(block.text)}</Tag>;
    }
    if (block.type === "list") {
      const items = block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>);
      return block.ordered ? <ol key={index}>{items}</ol> : <ul key={index}>{items}</ul>;
    }
    return <p key={index}>{renderInline(block.text)}</p>;
  });
}
