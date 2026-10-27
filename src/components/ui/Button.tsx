import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  if (variant === "ghost") {
    return (
      <button
        {...rest}
        className={`chamfer group bg-line p-px transition hover:bg-gold disabled:opacity-50 ${className}`}
      >
        <span className="chamfer-inner hud-label block bg-ink-2 px-5 py-2.5 text-gold transition group-hover:text-gold-bright">
          {children}
        </span>
      </button>
    );
  }

  return (
    <button
      {...rest}
      className={`chamfer hud-label bg-gold px-6 py-3 text-ink transition hover:bg-gold-bright disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}