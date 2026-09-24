import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50";

// Full class names are written out so Tailwind's scanner can detect them.
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 focus-visible:ring-purple-600",
  secondary:
    "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", type = "button", className, ...props },
  ref,
) {
  const classes = [base, variants[variant], className].filter(Boolean).join(" ");

  return <button ref={ref} type={type} className={classes} {...props} />;
});
