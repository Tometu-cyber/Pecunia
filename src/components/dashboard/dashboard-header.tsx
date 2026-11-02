"use client";

/**
 * En-tête de l'accueil : grand titre et menu « … » sur mobile, barre d'outils avec le filtre
 * de compte, les flèches de mois et « Nouvelle saisie » sur ordi.
 */
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AppHeader } from "@/components/ui/app-header";
import { PECUNIA_APP } from "@/components/ui/ds";
import { Menu } from "@/components/ui/menu";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useMoreMenuItems } from "@/components/app/navigation";

export interface FilterOption {
  id: string;
  label: string;
  href: string;
}

/** Au-delà de 4 choix (Tous + 3 comptes), le contrôle segmenté laisse la place à un menu. */
const MAX_SEGMENTS = 4;

/** Filtre de compte (Tous, Courant, Livret A…), en lien avec l'URL (?compte=). */
export function AccountFilter({ options, value, size = "regular", full }: { options: FilterOption[]; value: string; size?: "regular" | "small"; full?: boolean }) {
  const router = useRouter();
  const go = (id: string) => {
    const href = options.find((o) => o.id === id)?.href;
    if (href) router.push(href, { scroll: false });
  };
  if (options.length > MAX_SEGMENTS) {
    return <Menu label="Compte" size={size} value={value} items={options.map((o) => ({ id: o.id, label: o.label, href: o.href }))} />;
  }
  return <SegmentedControl label="Compte" size={size} full={full} value={value} onChange={go} items={options.map((o) => ({ id: o.id, label: o.label }))} />;
}

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
