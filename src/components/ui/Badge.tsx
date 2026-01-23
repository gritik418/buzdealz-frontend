import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          {
            "border-transparent bg-primary-600 text-white shadow hover:bg-primary-700": variant === "default",
            "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200": variant === "secondary",
            "border-transparent bg-red-500 text-white shadow hover:bg-red-600": variant === "destructive",
            "text-slate-950": variant === "outline",
            "border-transparent bg-emerald-500 text-white shadow hover:bg-emerald-600": variant === "success",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
