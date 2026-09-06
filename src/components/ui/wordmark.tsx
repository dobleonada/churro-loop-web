import Image from "next/image";
import type { ImageSource } from "@/lib/media";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  image: ImageSource;
  /** Required: the caller decides how the lockup is sized. */
  className: string;
  /** Set on the hero wordmark only: it is part of the LCP. */
  priority?: boolean;
}

/**
 * The "CHURRO LOOP" lockup. It comes from the CMS as an SVG with the custom
 * C/O ligatures, so it is never typeset with a font.
 */
export function Wordmark({ image, className, priority }: WordmarkProps) {
  return (
    <Image
      src={image.src}
      alt={image.alt || "Churro Loop"}
      width={image.width}
      height={image.height}
      priority={priority}
      unoptimized={image.isVector}
      className={cn("block", className)}
    />
  );
}
