/**
 * Briques d'interface partagées (boutons, cartes, champs, segments, puces, barres), au style
 * du design system « Portail » (design-system/README.md). Couleur d'accent : finances.
 * Pour du nouveau code, préférer les composants du design system (button.tsx, card.tsx…).
 */
import { clsx } from "clsx";
import Link from "next/link";
import { TriangleAlert, X } from "lucide-react";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode, SelectHTMLAttributes } from "react";
import type { BudgetStatus } from "@/lib/domain/budgets";
import { ScreenHeader } from "@/components/app/screen-header";
import { SegmentedControl } from "./segmented-control";
import { Spinner } from "./spinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

/**
 * Bouton capsule. primary = plein vert (une action principale par écran), secondary = gris,
 * ghost = texte vert seul, danger = rouge teinté (suppression).
 * 44 px de haut et 17 px sur mobile, 28 px et 13 px sur ordi.
 */
export function buttonClass(variant: ButtonVariant = "secondary", extra?: string) {
  return clsx(
    "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 [&>svg]:shrink-0 text-[17px] leading-[22px] font-semibold tracking-[-0.43px] transition-[color,background-color,filter,transform] duration-150 ease-out motion-safe:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 md:min-h-7 md:gap-1.5 md:px-3 md:text-[13px] md:leading-4 md:tracking-[-0.08px]",
    variant === "primary" && "bg-finances text-on-finances hover:brightness-105",
    variant === "secondary" && "bg-fill-secondary text-label hover:brightness-95",
    variant === "ghost" && "px-3 text-finances-text hover:bg-fill-tertiary md:px-2",
    variant === "danger" && "bg-danger/12 text-danger-text hover:bg-danger/18",
    extra,
  );
}

/** Bouton ; `loading` affiche un spinner et le désactive pendant un envoi. */
export function Button({
  variant = "secondary",
  className,
  type = "button",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }) {
  return (
    <button type={type} className={buttonClass(variant, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <Spinner size={15} />}
      {children}
    </button>
  );
}

/** Carte de contenu : fond blanc (gris foncé en sombre), arrondi radius-lg, jamais de verre. */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={clsx("min-w-0 rounded-lg bg-bg-grouped-secondary p-4 text-label shadow-card md:p-5", className)}>{children}</section>;
}

/** Titre de carte en sentence case, avec une action facultative à droite (« Voir tout »). */
export function CardHeader({ title, action }: { title: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="text-heading">{title}</h2>
      {action}
    </div>
  );
}

/** Lien d'action d'une carte (« Gérer », « Voir tout ») : texte vert. */
export const cardLinkClass = "text-[15px] font-semibold text-finances-text hover:underline md:text-[13px]";

/**
 * En-tête d'écran (grand titre sur mobile, barre d'outils sur ordi), voir ScreenHeader.
 * `kicker` devient la petite ligne verte au-dessus du titre sur mobile.
 */
export function PageHeader({
  kicker,
  title,
  subtitle,
  actions,
  mobileActions,
  center,
  back,
}: {
  kicker?: string;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Par défaut, les mêmes actions que sur ordi */
  mobileActions?: ReactNode;
  center?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <ScreenHeader
      eyebrow={kicker}
      title={title}
      subtitle={subtitle}
      actions={actions}
      mobileActions={mobileActions === undefined ? actions : mobileActions}
      center={center}
      back={back}
    />
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-foot font-semibold text-label-secondary">
      {children}
    </label>
  );
}

/**
 * Champ de saisie (TextField du design system) : fond gris doux, contour vert pendant la
 * saisie. 44 px et 17 px sur mobile (pas de zoom Safari), 28 px et 13 px sur ordi.
 */
export const inputClass = clsx(
  "block w-full min-h-11 rounded-[12px] border border-transparent bg-fill-tertiary px-3 text-[17px] leading-[22px] tracking-[-0.43px] text-label placeholder:text-label-tertiary transition-[border-color,box-shadow,background-color] duration-150 focus:border-finances focus:bg-bg-tertiary focus:shadow-[0_0_0_4px_var(--finances-bg)] focus:outline-none aria-[invalid=true]:border-danger md:min-h-7 md:rounded-xs md:px-2 md:text-[13px] md:leading-4 md:tracking-[-0.08px]",
  // Champs date : sans apparence native, Safari iOS colle la valeur en haut. Marge verticale
  // et interligne explicites pour la centrer (1 + 10 + 22 + 10 + 1 = 44 px ; 28 px sur ordi).
  "[&[type=date]]:py-[10px] [&[type=date]]:leading-[22px] md:[&[type=date]]:py-[5px] md:[&[type=date]]:leading-4",
);

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={clsx(inputClass, className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={clsx(inputClass, "pt-select pr-9 md:pr-7", className)} {...props}>
      {children}
    </select>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-foot font-medium text-danger-text">
      {children}
    </p>
  );
}

/** Choix côte à côte (Sortie / Entrée / Virement, 6 mois / 12 mois…) : SegmentedControl. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
  size = "md",
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
  /** Nom du groupe pour les lecteurs d'écran */
  label?: string;
}) {
  return (
    <SegmentedControl<T>
      value={value}
      onChange={onChange}
      label={label}
      size={size === "sm" ? "small" : "regular"}
      full={className?.includes("w-full")}
      className={clsx(size === "md" && "pt-seg-auto", className)}
      items={options.map((o) => ({ id: o.value, label: o.label }))}
    />
  );
}

/** Puce de filtre (« Tous », « • Courant »…) : capsule grise, verte une fois choisie. */
export function Chip({
  active,
  color,
  children,
  onClick,
  href,
}: {
  active: boolean;
  color?: string;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const className = clsx(
    "inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[15px] tracking-[-0.23px] transition-[color,background-color,transform] duration-150 ease-out motion-safe:active:scale-[0.97] md:min-h-7 md:gap-1.5 md:px-3 md:text-[13px] md:tracking-[-0.08px]",
    active ? "bg-finances-bg font-semibold text-finances-text" : "bg-fill-tertiary text-label hover:bg-fill-secondary",
  );
  const content = (
    <>
      {color && <span className="size-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />}
      {children}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={className} aria-current={active ? "true" : undefined} scroll={false}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} aria-pressed={active}>
      {content}
    </button>
  );
}

export const statusColor: Record<BudgetStatus, string> = {
  ok: "bg-finances",
  warn: "bg-warning",
  over: "bg-danger",
};

/** Texte coloré d'un statut de budget (le orange n'est jamais du texte : label en gras). */
export const statusText: Record<BudgetStatus, string> = {
  ok: "text-finances-text",
  warn: "text-label",
  over: "text-danger-text",
};

/** Jauge d'un budget : vert, orange à 80 %, rouge à 100 %. */
export function ProgressBar({ ratio, status, className }: { ratio: number; status: BudgetStatus; className?: string }) {
  const width = Math.max(0, Math.min(1, Number.isFinite(ratio) ? ratio : 1)) * 100;
  return (
    <div
      className={clsx("h-1.5 overflow-hidden rounded-full bg-fill-primary", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
    >
      <div className={clsx("h-full rounded-full transition-[width]", statusColor[status])} style={{ width: `${Math.max(width, width > 0 ? 1.5 : 0)}%` }} />
    </div>
  );
}

/** État vide : une phrase, et de préférence une action (« Ajoute ta première dépense »). */
export function EmptyState({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-md bg-fill-tertiary p-4 text-sub text-label-secondary">
      <p>{children}</p>
      {action}
    </div>
  );
}

export function Banner({
  tone,
  children,
  action,
  onClose,
}: {
  tone: "warn" | "danger" | "info" | "success";
  children: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={clsx(
        "flex items-start gap-3 rounded-md px-4 py-3 text-sub",
        tone === "warn" && "bg-warning/15 text-label",
        tone === "danger" && "bg-danger/12 text-danger-text",
        tone === "info" && "bg-fill-tertiary text-label",
        tone === "success" && "bg-finances-bg text-finances-text",
      )}
    >
      {tone === "warn" && <TriangleAlert size={18} strokeWidth={1.75} className="mt-px shrink-0 text-warning" aria-hidden />}
      <div className="min-w-0 flex-1">{children}</div>
      {action}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="-my-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full opacity-70 hover:bg-fill-tertiary hover:opacity-100 md:size-7"
          aria-label="Fermer"
        >
          <X size={16} strokeWidth={2} aria-hidden />
        </button>
      )}
    </div>
  );
}
