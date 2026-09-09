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

/**
 * Drops `**` from a field the CMS models as plain text but the editors wrote
 * as Markdown — `franchiseCta.title` and `contact.title` are both
 * `**LIKE THIS**` in English. Reported as churro-loop-web-3ia.2; stripping it
 * here keeps the asterisks off the page in the meantime.
 */
export function stripEmphasis(source: string): string {
  return source.replace(/\*\*/g, "").trim();
}

/**
 * Splits the leading paragraph off a rich-text field, for the fields that pack
 * a heading and its body into one — `franchiseCta.text` starts with the claim
 * "**ABRE EL PRÓXIMO CHURRO LOOP.**" and continues with the body copy, and the
 * design sets those as two different elements.
 *
 * The body is returned unparsed, so `Markdown` still handles its line breaks.
 */
export function splitLeadParagraph(source: string): [lead: string, body: string] {
  const [lead = "", ...rest] = source.split(/\n\s*\n/);

  return [stripEmphasis(lead), rest.join("\n\n")];
}
