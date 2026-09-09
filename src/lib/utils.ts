/** Joins conditional class names. Deliberately tiny: no clsx dependency. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
