import { type ButtonHTMLAttributes, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

// Combine Framer Motion props with our Button props
type MotionButtonProps = ButtonProps & HTMLMotionProps<"button">;

export const Button = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20": variant === "default",
            "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900": variant === "outline",
            "hover:bg-slate-100 text-slate-700": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20": variant === "danger",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-12 px-6 text-lg": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
