import { clsx } from "clsx";
import { formatCents, formatCentsCompact, type SignDisplay } from "@/lib/domain/money";
import type { TransactionType } from "@/lib/domain/types";

/**
 * Montant coloré selon les règles transverses : entrée « + » en vert, sortie sans signe
 * positif en texte normal, virement neutre en gris en vue consolidée.
 */
export function Amount({
  cents,
  type,
  neutral = false,
  compact = false,
  className,
}: {
  cents: number;
  type?: TransactionType;
  /** Virement vu en « tous comptes » : montant brut, gris */
  neutral?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const sign: SignDisplay = neutral ? "never" : cents > 0 ? "always" : "auto";
  const text = compact ? formatCentsCompact(cents, sign) : formatCents(cents, sign);
  return (
    <span
      className={clsx(
        "whitespace-nowrap tabular-nums",
        neutral || type === "transfer" ? "text-label-secondary" : cents > 0 ? "font-semibold text-finances-text" : "font-semibold text-label",
        className,
      )}
    >
      {text}
    </span>
  );
}
