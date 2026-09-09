import type { ElementType } from "react";
import { stripEmphasis } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Heading level. Every section on the home page is an `h2`. */
  as?: ElementType;
  /** Set when the section uses `aria-labelledby` to point at this heading. */
  titleId?: string;
  className?: string;
}

/**
 * Eyebrow + display heading, both purple and centred. Repeats across five
 * sections, so the type scale lives here rather than in each one.
 */
export function SectionHeading({
  eyebrow,
  title,
  as,
  titleId,
  className,
}: SectionHeadingProps) {
  const Heading = (as ?? "h2") as ElementType;

  return (
    <div className={cn("text-center text-purple", className)}>
      {/* Both are stripped: several of these fields arrive from the CMS
          wrapped in `**` (see churro-loop-web-3ia.2). */}
      <p className="font-display text-eyebrow uppercase">
        {stripEmphasis(eyebrow)}
      </p>
      <Heading id={titleId} className="mt-2.5 font-display text-h2">
        {stripEmphasis(title)}
      </Heading>
    </div>
  );
}
