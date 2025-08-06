import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center bg-gray-100 text-sm font-medium text-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
