// lib/utils.ts

// For merging Tailwind class names safely
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Format currency (PKR-style)
export function formatCurrency(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

// Shorten text (for cards, titles)
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

