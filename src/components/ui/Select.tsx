"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

export type SelectOption = { value: string; label: string };

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label: string;
  className?: string;
};

function Hex({ filled }: { filled: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden className="shrink-0">
      <polygon
        points="6,0.8 10.5,3.4 10.5,8.6 6,11.2 1.5,8.6 1.5,3.4"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Custom dropdown. The menu is rendered in a portal with fixed positioning,
 * so panels with clipped corners (clip-path) can never cut it off.
 */
export default function Select({ value, onChange, options, label, className = "" }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  function openMenu() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    setActive(selectedIndex);
    setOpen(true);
  }

  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !triggerRef.current?.contains(t)) close();
    };
    const onScroll = (e: Event) => {
      if (!menuRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openMenu();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => Math.min(options.length - 1, Math.max(0, i + step)));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(active);
      else openMenu();
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`chamfer inline-block p-px transition-colors ${
          open ? "bg-gold" : "bg-line hover:bg-gold"
        } ${className}`}
      >
        <span className="chamfer-inner flex min-w-44 items-center gap-3 bg-ink px-4 py-2 font-display text-[15px] font-semibold tracking-[0.1em] text-paper uppercase">
          <span className="text-gold">
            <Hex filled={open} />
          </span>
          <span className="flex-1 text-left">{selected?.label}</span>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            aria-hidden
            className={`text-gold transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M0.5 0.5 5 5 9.5 0.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="chamfer bg-gold p-px"
            style={{ position: "fixed", top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 70 }}
          >
            <ul
              ref={menuRef}
              id={listId}
              role="listbox"
              aria-label={label}
              className="chamfer-inner max-h-64 overflow-y-auto border-t-2 border-gold bg-pearl py-1"
            >
              {options.map((option, i) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(i)}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-2 font-display text-[15px] font-semibold tracking-[0.1em] whitespace-nowrap uppercase ${
                      i === active ? "bg-ice/35" : ""
                    } ${isSelected ? "text-paper" : "text-gold-dim"}`}
                  >
                    <span className={isSelected ? "text-gold" : "text-transparent"}>
                      <Hex filled />
                    </span>
                    {option.label}
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
}
