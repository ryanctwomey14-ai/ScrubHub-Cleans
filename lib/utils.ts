/** Join class names, skipping falsy values (shadcn-style `cn`, without extra dependencies). */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
