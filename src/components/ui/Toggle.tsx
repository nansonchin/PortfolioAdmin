type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
};

/**
 * Parallelogram switch. The whole control is one skewed box with a real border,
 * so the outline, the fill and the knob all share exactly the same slant.
 * Only the ON / OFF text is skewed back so it stays upright.
 */
export default function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative mx-1 inline-block h-6 w-14 shrink-0 skew-x-[-15deg] border transition-colors disabled:opacity-50 ${
        checked ? "border-navy bg-navy" : "border-gold/50 bg-ink hover:border-gold"
      }`}
    >
      <span
        className={`absolute inset-y-0 flex skew-x-[15deg] items-center font-system text-[10px] tracking-[0.12em] ${
          checked ? "left-2.5 text-ice" : "right-2.5 text-gold-dim"
        }`}
      >
        {checked ? "ON" : "OFF"}
      </span>
      <span
        aria-hidden
        className={`absolute top-[3px] bottom-[3px] left-1 w-4 transition-transform duration-200 ${
          checked ? "translate-x-[30px] bg-ice" : "translate-x-0 bg-slate"
        }`}
      />
    </button>
  );
}
