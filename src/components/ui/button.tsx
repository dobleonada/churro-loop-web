import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared pill styling for every call to action on the site. */
export const buttonClassName = cn(
  "inline-flex h-[42px] items-center justify-center rounded-full px-9",
  "font-sans text-button font-semibold uppercase",
  "bg-purple text-white transition-colors hover:bg-purple-deep",
  "disabled:pointer-events-none disabled:opacity-60"
);

type ButtonProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Purple pill button. Renders a `<button>` by default; pass `as="a"` (or the
 * locale-aware `Link`) when it navigates somewhere.
 */
export function Button<T extends ElementType = "button">({
  as,
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Component = (as ?? "button") as ElementType;

  return (
    <Component className={cn(buttonClassName, className)} {...props}>
      {children}
    </Component>
  );
}
