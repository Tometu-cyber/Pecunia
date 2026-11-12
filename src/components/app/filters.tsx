import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, monthLabel, type MonthKey } from "@/lib/domain/dates";
import type { Account } from "@/lib/domain/types";
import { withParams } from "@/lib/data/views";
import { shortAccountName } from "@/lib/domain/accounts";
import { AccountFilter } from "./account-filter";
import { Button } from "@portail/ui";
import Link from "next/link";

/** ‹ Septembre 2026 › - bloqué au-delà du mois courant. Boutons gris ronds du design system. */
export function MonthSwitcher({
  path,
  month,
  current,
  params = {},
}: {
  path: string;
  month: MonthKey;
  current: MonthKey;
  params?: Record<string, string | null | undefined>;
}) {
  const next = addMonths(month, 1);
  const canGoNext = next <= current;
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="gray"
        size="small"
        icon={ChevronLeft}
        linkAs={Link}
        href={withParams(path, { ...params, mois: addMonths(month, -1) })}
        aria-label="Mois précédent"
        className="size-9 !px-0 md:size-7"
      />
      <h2 className="min-w-0 text-[20px] leading-[25px] font-semibold tracking-[-0.45px] md:min-w-36 md:text-center md:text-[15px] md:leading-5 md:tracking-[-0.23px]">
        {monthLabel(month)}
      </h2>
      <Button
        variant="gray"
        size="small"
        icon={ChevronRight}
        linkAs={Link}
        href={canGoNext ? withParams(path, { ...params, mois: next === current ? null : next }) : undefined}
        disabled={!canGoNext}
        aria-label="Mois suivant"
        className="size-9 !px-0 md:size-7"
      />
    </div>
  );
}

/**
 * Filtre « Tous » + un choix par compte actif (filtre dans l'URL) : contrôle segmenté
 * jusqu'à 3 comptes, menu au-delà.
 */
export function AccountChips({
  path,
  accounts,
  selected,
  params = {},
  allLabel = "Tous",
  full,
}: {
  path: string;
  accounts: Account[];
  selected: string | null;
  params?: Record<string, string | null | undefined>;
  allLabel?: string;
  /** Pleine largeur (mobile) */
  full?: boolean;
}) {
  const options = [
    { id: "all", label: allLabel, href: withParams(path, { ...params, compte: null }) },
    ...accounts.map((a) => ({ id: a.id, label: shortAccountName(a), href: withParams(path, { ...params, compte: a.id }) })),
  ];
  return <AccountFilter options={options} value={selected ?? "all"} full={full} />;
}
