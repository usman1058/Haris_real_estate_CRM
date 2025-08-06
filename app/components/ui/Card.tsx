import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("bg-white dark:bg-neutral-800 rounded-2xl shadow-card p-4", className)}>
      {children}
    </div>
  );
}