import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

type Variant = "primary" | "dark" | "outline" | "white";

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  icon?: LucideIcon;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
  type?: never;
  onClick?: never;
  formAction?: never;
};

type ButtonProps = CommonProps & {
  href?: never;
  external?: never;
  /** Si "submit" → bouton de form. "button" pour onClick simple. */
  type: "submit" | "button" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  formAction?: string | ((formData: FormData) => void | Promise<void>);
};

type Props = LinkProps | ButtonProps;

/**
 * CTA inspiré ihos.fr : 3 coins arrondis + bas-gauche carré + icône flèche
 * dans un carré à droite avec les MÊMES coins.
 * Préserve la DA Bisecco (orange brand-500 ou navy ink-700).
 */
export function CtaButton(props: Props) {
  const {
    children,
    variant = "primary",
    className = "",
    icon: Icon = ArrowUpRight,
    size = "md",
    disabled,
  } = props;

  const sizeClasses = {
    sm: "pl-3.5 pr-1.5 py-2 text-[0.78rem] gap-2",
    md: "pl-4 pr-2 py-2.5 text-[0.86rem] gap-2.5",
    lg: "pl-5 pr-2.5 py-3 text-[0.92rem] gap-3",
  };

  const iconBoxSize = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-8 h-8",
  };

  const iconSize = { sm: 13, md: 14, lg: 16 };

  const variants: Record<Variant, { btn: string; box: string }> = {
    primary: {
      btn: "bg-brand-500 text-white shadow-[0_8px_20px_-4px_rgba(240,122,47,0.45)] hover:bg-brand-600 hover:-translate-y-0.5",
      box: "bg-white/20 text-white",
    },
    dark: {
      btn: "bg-ink-700 text-white shadow-[0_8px_20px_-4px_rgba(13,30,74,0.35)] hover:bg-ink-800 hover:-translate-y-0.5",
      box: "bg-white/15 text-white",
    },
    outline: {
      btn: "bg-transparent text-ink-700 border-2 border-ink-700 hover:bg-ink-700 hover:text-white",
      box: "bg-ink-700 text-white group-hover:bg-white group-hover:text-ink-700",
    },
    white: {
      btn: "bg-white text-ink-700 shadow-[0_8px_20px_-4px_rgba(13,30,74,0.18)] hover:bg-ink-50 hover:-translate-y-0.5",
      box: "bg-brand-500 text-white",
    },
  };

  const v = variants[variant];
  const base = `group inline-flex items-center font-semibold whitespace-nowrap transition-all rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-none ${sizeClasses[size]}`;

  const content = (
    <>
      <span>{children}</span>
      <span
        className={`inline-flex items-center justify-center rounded-tl-md rounded-tr-md rounded-br-md rounded-bl-none transition-transform duration-300 group-hover:rotate-[20deg] ${iconBoxSize[size]} ${v.box}`}
        aria-hidden
      >
        <Icon size={iconSize[size]} strokeWidth={2.4} />
      </span>
    </>
  );

  const disabledCls = disabled ? "opacity-50 pointer-events-none" : "";
  const finalCls = `${base} ${v.btn} ${disabledCls} ${className}`;

  // ── Mode bouton (form submit / onClick) ───────────────────────────────────
  if ("type" in props && props.type) {
    return (
      <button
        type={props.type}
        onClick={props.onClick}
        formAction={typeof props.formAction === "string" ? props.formAction : undefined}
        disabled={disabled}
        className={finalCls}
      >
        {content}
      </button>
    );
  }

  // ── Mode lien ─────────────────────────────────────────────────────────────
  const href = props.href;
  const isExternal = props.external || href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={finalCls}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={finalCls}>
      {content}
    </Link>
  );
}
