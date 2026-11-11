import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  /** Shows a spinner and a sweeping bar, and disables the button. */
  loading?: boolean;
};

const LABEL = "font-display text-[15px] font-semibold tracking-[0.12em] uppercase";

/** Class strings are exported so links can look like buttons. */
export function buttonClasses(variant: Variant = "primary", extra = "") {
  if (variant === "ghost") {
    return `group relative inline-block skew-x-[-15deg] border border-gold/50 bg-ink-2 px-6 py-2.5 transition-colors hover:border-gold hover:bg-ink focus-visible:border-gold disabled:opacity-50 ${extra}`;
  }
  // navy body, ice text on focus, one thin warm underline
  return `para ${LABEL} relative inline-flex items-center justify-center gap-2 overflow-hidden bg-navy px-8 py-3 text-white shadow-[inset_0_-3px_0_var(--color-amber)] transition hover:bg-navy-2 focus-visible:bg-ice focus-visible:text-navy active:translate-y-px disabled:opacity-45 ${extra}`;
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export default function Button({
  variant = "primary",
  loading = false,
  className = "",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === "ghost") {
    return (
      <button
        {...rest}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={buttonClasses("ghost", className)}
      >
        <span
          className={`block skew-x-[15deg] ${LABEL} text-gold transition-colors group-hover:text-gold-bright ${
            loading ? "flex items-center gap-2" : ""
          }`}
        >
          {loading && <Spinner />}
          {children}
        </span>
      </button>
    );
  }

  return (
    <button
      {...rest}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={buttonClasses("primary", className)}
    >
      {loading && <Spinner />}
      {children}
      {loading && (
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-white/15">
          <span className="btn-sweep" />
        </span>
      )}
    </button>
  );
}
