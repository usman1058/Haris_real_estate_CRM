import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants: Record<string, string> = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      ghost: "bg-transparent hover:bg-gray-100",
    };

    const sizes: Record<string, string> = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3",
      icon: "h-8 w-8",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
