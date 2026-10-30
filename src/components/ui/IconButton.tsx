import type { ReactNode } from "react";

type IconButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
};

export default function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`hud-label border border-line px-2 py-1 text-muted transition disabled:opacity-30 disabled:hover:text-muted ${
        danger ? "hover:text-alert" : "hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}