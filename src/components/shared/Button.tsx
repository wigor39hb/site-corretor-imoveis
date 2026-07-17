"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline-gold" | "whatsapp" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gold-500 text-navy-900 hover:bg-gold-400 font-semibold uppercase tracking-widest",
  secondary:
    "border border-white text-white hover:border-gold-500 hover:text-gold-500 bg-transparent uppercase tracking-widest",
  "outline-gold":
    "border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-900 bg-transparent uppercase tracking-widest",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe59] font-semibold",
  ghost: "text-neutral-600 hover:text-navy-900 bg-transparent",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-sm transition-all duration-300",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className,
        ].join(" ")}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
