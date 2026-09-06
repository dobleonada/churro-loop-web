/**
 * Splits a Strapi rich-text field into plain-text paragraphs, dropping the
 * `**bold**` markers.
 *
 * Some CMS fields pack more than one piece of the design into a single
 * markdown field — `loops.intro` holds both the section heading and the
 * "MUY PRONTO" status, separated by a blank line — and those two are
 * different elements in the design, not one block of copy. Use this to take
 * them apart; use the `Markdown` component when the field really is one
 * block of prose.
 */
export function toPlainParagraphs(source: string): string[] {
  return source
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\*\*/g, "").trim())
    .filter(Boolean);
}
