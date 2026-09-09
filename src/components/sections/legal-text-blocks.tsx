import { Markdown } from "@/components/ui/markdown";
import { stripEmphasis } from "@/lib/rich-text";
import type { LegalTextBlockDto } from "@/services/legal/legal.dto";

/**
 * The body of a legal page: the ordered list of `legalText` clauses, each a
 * heading and a block of prose.
 *
 * These are the only long-form reading pages on the site, so they set copy
 * left-aligned at a readable measure instead of the centred, tightly
 * constrained blocks the home page uses. The headings are purple display
 * type, which is what ties them back to the brand.
 *
 * Titles are stripped and trimmed — the CMS holds one with a trailing newline
 * ("Condiciones de Uso\n") — and may be missing entirely, in which case the
 * block continues the clause above and renders as prose alone.
 */
export function LegalTextBlocks({ blocks }: { blocks: LegalTextBlockDto[] }) {
  return (
    <div className="mt-10 space-y-9 lg:mt-14 lg:space-y-12">
      {blocks.map((block) => {
        const title = block.title ? stripEmphasis(block.title) : "";

        return (
          <section key={block.id}>
            {title && (
              <h2 className="font-display text-h3 text-purple">{title}</h2>
            )}

            <Markdown
              source={block.text}
              className={`text-body text-ink [&>p+p]:mt-[1em] ${title ? "mt-3" : ""}`}
            />
          </section>
        );
      })}
    </div>
  );
}
