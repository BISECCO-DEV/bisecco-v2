"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Briefcase, Check, Search } from "lucide-react";
import { METIER_OPTIONS, type MetierOption } from "@/lib/metiers";

export { METIER_OPTIONS };
export type { MetierOption };


type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  variant?: "dark" | "light";
  /** Si défini, le label ne s'affiche pas dans l'input (mode inline simple) */
  hideLabel?: boolean;
  /** Icon à afficher devant (par défaut Briefcase) */
  leadingIcon?: React.ReactNode;
};

export function MetierCombobox({
  value,
  onChange,
  placeholder = "Tous les métiers",
  label = "MÉTIER",
  variant = "dark",
  hideLabel = false,
  leadingIcon,
}: Props) {
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  /** Liste filtrée par la query */
  const filtered = METIER_OPTIONS.filter((m) =>
    m.name.toLowerCase().includes(value.toLowerCase())
  );

  /** Grouper par catégorie */
  const grouped = filtered.reduce<Record<string, MetierOption[]>>((acc, m) => {
    (acc[m.category] = acc[m.category] || []).push(m);
    return acc;
  }, {});
  const categories = Object.keys(grouped);

  /** Liste plate pour la navigation clavier */
  const flat = filtered;

  /** Fermer au clic extérieur */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /** Échap pour fermer */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const select = (opt: MetierOption) => {
    onChange(opt.name);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && flat[activeIdx]) {
        e.preventDefault();
        select(flat[activeIdx]);
      }
    }
  };

  const isDark = variant === "dark";
  const styles = isDark
    ? {
        wrapper: "bg-ink-900/50 border-white/10 hover:border-white/20",
        wrapperFocus: "border-brand-500/50 ring-2 ring-brand-500/15",
        iconColor: "text-white/40",
        labelColor: "text-white/40",
        inputText: "text-white placeholder:text-white/30",
        clearBtn: "text-white/30 hover:text-white/70",
        caret: "text-white/40",
        dropdown: "bg-[#0c1a3e] border-white/10",
        dropdownShadow: "shadow-[0_24px_60px_rgba(0,0,0,0.5)]",
        headerBorder: "border-white/5",
        headerText: "text-white/60",
        headerHint: "text-white/30",
        catHeader: "bg-[#0c1a3e] text-brand-400 border-white/5",
        emptyText: "text-white/40",
        emptyStrong: "text-white/70",
        itemHover: "hover:bg-white/[0.03]",
        itemActive: "bg-brand-500/15",
        itemText: "text-white/85",
        itemSelected: "text-brand-400",
      }
    : {
        wrapper: "bg-ink-50 border-ink-200 hover:border-ink-300",
        wrapperFocus: "border-brand-500 ring-2 ring-brand-500/15 bg-white",
        iconColor: "text-ink-300",
        labelColor: "text-ink-400",
        inputText: "text-ink-700 placeholder:text-ink-300",
        clearBtn: "text-ink-300 hover:text-ink-600",
        caret: "text-ink-300",
        dropdown: "bg-white border-ink-100",
        dropdownShadow: "shadow-[0_24px_60px_rgba(14,30,68,0.18)]",
        headerBorder: "border-ink-100",
        headerText: "text-ink-500",
        headerHint: "text-ink-300",
        catHeader: "bg-white text-brand-600 border-ink-100",
        emptyText: "text-ink-400",
        emptyStrong: "text-ink-700",
        itemHover: "hover:bg-ink-50",
        itemActive: "bg-brand-50",
        itemText: "text-ink-700",
        itemSelected: "text-brand-600",
      };

  const showLabel = !hideLabel && label;
  const Icon = leadingIcon ?? <Briefcase size={16} className={`${styles.iconColor} flex-shrink-0`} />;

  return (
    <div ref={wrapperRef} className="relative">
      {/* Input wrapper */}
      <div
        className={`flex items-center gap-2.5 px-4 ${showLabel ? "py-3" : "py-3"} rounded-xl border transition cursor-text ${
          open ? styles.wrapperFocus : styles.wrapper
        }`}
        onClick={() => {
          inputRef.current?.focus();
          setOpen(true);
        }}
      >
        {Icon}
        <div className="flex-1 min-w-0">
          {showLabel && (
            <label htmlFor={id} className={`text-[0.65rem] ${styles.labelColor} font-bold tracking-wider uppercase block`}>
              {label}
            </label>
          )}
          <input
            id={id}
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
              setActiveIdx(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            className={`w-full bg-transparent text-sm outline-none ${styles.inputText}`}
          />
        </div>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              inputRef.current?.focus();
            }}
            className={`${styles.clearBtn} transition text-lg leading-none`}
            aria-label="Effacer"
          >
            ×
          </button>
        )}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${styles.caret} flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-2xl border overflow-hidden animate-slide-up ${styles.dropdown} ${styles.dropdownShadow}`}
          style={{ animationDuration: "0.18s" }}
        >
          {/* Header avec compteur */}
          <div className={`flex items-center justify-between px-4 py-2.5 border-b ${styles.headerBorder}`}>
            <div className={`flex items-center gap-2 ${styles.headerText} text-xs`}>
              <Search size={12} />
              <span className="font-semibold">
                {flat.length} métier{flat.length > 1 ? "s" : ""}{value && ` pour "${value}"`}
              </span>
            </div>
            <span className={`text-[0.65rem] ${styles.headerHint} font-semibold tracking-wider uppercase hidden sm:inline`}>
              ↑↓ ↵
            </span>
          </div>

          {/* Liste */}
          <div className="max-h-[280px] overflow-y-auto scrollbar-hide">
            {flat.length === 0 ? (
              <div className={`px-4 py-8 text-center ${styles.emptyText} text-sm`}>
                Aucun métier ne correspond à <strong className={styles.emptyStrong}>&quot;{value}&quot;</strong>
              </div>
            ) : (
              categories.map((cat) => (
                <div key={cat}>
                  <div className={`sticky top-0 z-10 px-4 py-1.5 text-[0.62rem] font-bold tracking-[0.12em] uppercase border-b ${styles.catHeader}`}>
                    {cat}
                  </div>
                  {grouped[cat].map((opt) => {
                    const idx = flat.indexOf(opt);
                    const active = idx === activeIdx;
                    const selected = value === opt.name;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => select(opt)}
                        onMouseEnter={() => setActiveIdx(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          active ? styles.itemActive : styles.itemHover
                        }`}
                      >
                        <span className="text-base leading-none w-5 text-center">{opt.icon}</span>
                        <span className={`text-sm flex-1 ${selected ? `${styles.itemSelected} font-bold` : styles.itemText}`}>
                          {opt.name}
                        </span>
                        {selected && <Check size={14} className={styles.itemSelected} />}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
