"use client";

/**
 * En-tête de l'accueil : grand titre et menu « … » sur mobile, barre d'outils avec le filtre
 * de compte, les flèches de mois et « Nouvelle saisie » sur ordi.
 */
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMoreMenuItems } from "@/components/app/navigation";
import { AccountFilter, type FilterOption } from "@/components/app/account-filter";
import { AppHeader } from "@portail/ui";
import { PECUNIA_APP } from "@/components/ui/app";

export { AccountFilter, type FilterOption } from "@/components/app/account-filter";

export function DashboardHeader({
  title,
  monthLabel,
  prevHref,
  nextHref,
  accountOptions,
  accountValue,
}: {
  title: string;
  monthLabel: string;
  prevHref: string;
  /** null : mois courant, pas de mois suivant */
  nextHref: string | null;
  accountOptions: FilterOption[];
  accountValue: string;
}) {
  const more = useMoreMenuItems();
  return (
    <>
      {/* display: contents garde l'en-tête collant par rapport à la page entière */}
      <div className="contents md:hidden">
        <AppHeader app={PECUNIA_APP} eyebrow="Pecunia" title={title} actions={[{ menu: { iconOnly: true, label: "Plus", align: "end", items: more } }]} />
      </div>
      <AppHeader
        className="max-md:hidden"
        platform="mac"
        app={PECUNIA_APP}
        title={title}
        subtitle={monthLabel}
        center={<AccountFilter options={accountOptions} value={accountValue} size="small" />}
        actions={[
          { icon: ChevronLeft, label: "Mois précédent", href: prevHref },
          { icon: ChevronRight, label: "Mois suivant", href: nextHref ?? undefined, disabled: !nextHref },
          { icon: Plus, children: "Nouvelle saisie", prominent: true, href: "/saisie" },
        ]}
      />
    </>
  );
}
