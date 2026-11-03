import { clsx } from "clsx";
import { IconBadge } from "@/components/ui/icons";
import { Amount } from "@/components/ui/money";
import { shortAccountName } from "@/lib/domain/accounts";
import type { Account, Category, Transaction } from "@/lib/domain/types";

const TYPE_TAG: Partial<Record<Transaction["type"], string>> = {
  adjust: "Régularisation",
  interest: "Intérêts",
};

/** Ligne de transaction : icône de catégorie (ou virement), lieu, sous-texte, montant coloré. */
export function TransactionRow({
  tx,
  category,
  account,
  counterpart,
  consolidated,
  showAccount = true,
  onClick,
}: {
  tx: Transaction;
  category?: Category;
  account?: Account;
  counterpart?: Account;
  /** Vue « tous comptes » : virement affiché une fois, montant brut en gris */
  consolidated: boolean;
  showAccount?: boolean;
  onClick?: () => void;
}) {
  const isTransfer = tx.type === "transfer";
  const icon = isTransfer ? "transfer" : tx.type === "adjust" ? "adjust" : (category?.icon ?? "circle");
  const color = isTransfer ? "var(--gray)" : tx.type === "adjust" ? "var(--gray-2)" : (category?.color ?? "var(--gray)");
  const accountLabel =
    isTransfer && account && counterpart
      ? consolidated || tx.amountCents < 0
        ? `${shortAccountName(account)} → ${shortAccountName(counterpart)}`
        : `${shortAccountName(counterpart)} → ${shortAccountName(account)}`
      : account
        ? shortAccountName(account)
        : "";
  const categoryLabel = isTransfer ? "Virement interne · hors budget" : tx.type === "adjust" ? "Régularisation" : category?.name;
  const sub = [showAccount ? accountLabel : null, categoryLabel, tx.note].filter(Boolean).join(" · ");
  const tag = TYPE_TAG[tx.type];

  return (
    <button
      type="button"
      onClick={onClick}
      // ligne de liste du design system (ListRow) : repère rond, titre, sous-titre, montant
      className={clsx(
        "flex min-h-11 w-full items-center gap-3 bg-bg-grouped-secondary px-4 py-2.5 text-left md:py-2",
        onClick && "hover:bg-fill-tertiary active:bg-fill-secondary",
      )}
    >
      <IconBadge icon={icon} color={color} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-body">
          <span className="truncate">{tx.place || (isTransfer ? "Virement" : "Sans libellé")}</span>
          {tag && tx.type !== "adjust" && (
            <span className="shrink-0 rounded-full bg-finances-bg px-2 py-0.5 text-foot font-semibold text-finances-text">{tag}</span>
          )}
        </p>
        <p className="truncate text-sub text-label-secondary">{sub}</p>
      </div>
      <Amount cents={consolidated && isTransfer ? Math.abs(tx.amountCents) : tx.amountCents} type={tx.type} neutral={consolidated && isTransfer} className="text-body" />
    </button>
  );
}
