"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useState, useTransition, type CSSProperties, type ReactNode } from "react";
import {
  ArrowLeftRight,
  ChartColumn,
  CreditCard,
  Euro,
  House,
  LayoutGrid,
  ListFilter,
  LogOut,
  Menu as MenuIcon,
  Plus,
  SlidersHorizontal,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "@/lib/data/actions";
import { formatCents } from "@/lib/domain/money";
import { APP_NAME, versionLabel } from "@/lib/version";
import { Modal } from "@/components/ui/overlay";
import { AppIcon } from "@/components/ui/app-icon";
import { PECUNIA_APP } from "@/components/ui/ds";
import type { MenuItem } from "@/components/ui/menu";
import { Sidebar as DsSidebar } from "@/components/ui/sidebar";
import { TabBar } from "@/components/ui/tab-bar";
import { useAppData } from "./app-data";
import { QuickEntryForm } from "@/components/entry/quick-entry-form";
import { SubmitButton } from "@/components/ui/submit-button";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const MAIN: NavItem[] = [
  { href: "/", label: "Accueil", icon: House },
  { href: "/saisie", label: "Saisie", icon: Plus },
  { href: "/transactions", label: "Transactions", icon: ListFilter },
  { href: "/comptes", label: "Comptes", icon: CreditCard },
  { href: "/prevision", label: "Prévisionnel", icon: TrendingUp },
  { href: "/budgets", label: "Budgets", icon: Euro },
];

const MANAGEMENT: NavItem[] = [
  { href: "/categories", label: "Catégories", icon: LayoutGrid },
  { href: "/recurrences", label: "Récurrences", icon: ArrowLeftRight },
  { href: "/analyses", label: "Analyses", icon: ChartColumn },
  { href: "/parametres", label: "Paramètres", icon: SlidersHorizontal },
];

/** Écrans de la barre d'onglets mobile (le + à droite ouvre la saisie rapide). */
const TABS: NavItem[] = [
  { href: "/", label: "Accueil", icon: House },
  { href: "/transactions", label: "Transactions", icon: ListFilter },
  { href: "/prevision", label: "Prévision", icon: TrendingUp },
  { href: "/budgets", label: "Budgets", icon: Euro },
];

/** Écrans de la navigation secondaire mobile (menu « … » de l'en-tête). */
const MORE: NavItem[] = [
  { href: "/comptes", label: "Comptes", icon: CreditCard },
  { href: "/categories", label: "Catégories", icon: LayoutGrid },
  { href: "/recurrences", label: "Récurrences", icon: ArrowLeftRight },
  { href: "/analyses", label: "Analyses", icon: ChartColumn },
];

/** Écrans déjà refaits avec le design system : ils gèrent eux-mêmes en-tête et marges. */
const DS_ROUTES = ["/"];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function activeHref(pathname: string, items: NavItem[]) {
  return items.find((i) => isActive(pathname, i.href))?.href;
}

/** Barre latérale en verre (ordinateur, 768 px et plus). */
export function Sidebar() {
  const pathname = usePathname();
  const { profile, netWorthCents } = useAppData();
  const toItem = (i: NavItem) => ({ id: i.href, label: i.label, icon: i.icon, href: i.href });
  return (
    <div className="pt-sidebar-dock max-md:hidden">
      <DsSidebar
        label="Pecunia"
        app={PECUNIA_APP}
        windowControls={false}
        active={activeHref(pathname, [...MAIN, ...MANAGEMENT]) ?? ""}
        sections={[
          { title: "Pecunia", items: MAIN.map(toItem) },
          { title: "Gestion", items: MANAGEMENT.map(toItem) },
        ]}
        footer={
          <>
            <div className="rounded-[12px] bg-fill-tertiary px-3 py-2.5">
              <span className="block text-[11px] leading-[14px] font-semibold text-label-secondary">Patrimoine</span>
              <b className="font-rounded text-[20px] leading-[25px] font-bold tabular-nums">{formatCents(netWorthCents)}</b>
            </div>
            <div className="mt-2.5 flex items-center gap-2 px-1 text-[12px] leading-[15px] text-label-secondary">
              <AppIcon app={PECUNIA_APP} size={28} />
              <div className="min-w-0 flex-1">
                <b className="block truncate text-[13px] text-label">{profile.displayName ?? profile.email.split("@")[0]}</b>
                {APP_NAME} {versionLabel()}
              </div>
              <form action={signOut}>
                <SubmitButton className="pt-side-icon-btn" aria-label="Se déconnecter" title="Se déconnecter" pendingChildren={null}>
                  <LogOut size={16} strokeWidth={1.75} aria-hidden />
                </SubmitButton>
              </form>
            </div>
          </>
        }
      />
    </div>
  );
}

/** Barre d'onglets flottante en verre (mobile) ; le + vert à droite ouvre la saisie rapide. */
export function BottomNav() {
  const pathname = usePathname();
  const [entryOpen, setEntryOpen] = useState(false);
  return (
    <>
      <div className="pt-tabbar-dock md:hidden">
        <TabBar
          app={PECUNIA_APP}
          active={activeHref(pathname, TABS) ?? ""}
          items={TABS.map((t) => ({ id: t.href, label: t.label, icon: t.icon, href: t.href }))}
          action={{ icon: Plus, label: "Nouvelle saisie", prominent: true, onClick: () => setEntryOpen(true) }}
        />
      </div>
      <Modal open={entryOpen} onClose={() => setEntryOpen(false)} size="lg">
        <QuickEntryForm variant="sheet" onDone={() => setEntryOpen(false)} />
      </Modal>
    </>
  );
}

/** Items du menu « … » de l'en-tête mobile : écrans secondaires, Paramètres, déconnexion. */
export function useMoreMenuItems(): MenuItem[] {
  const [, startTransition] = useTransition();
  return [
    ...MORE.map((i) => ({ id: i.href, label: i.label, icon: i.icon, href: i.href })),
    { divider: true as const },
    { id: "/parametres", label: "Paramètres", icon: SlidersHorizontal, href: "/parametres" },
    { id: "signout", label: "Se déconnecter", icon: LogOut, onSelect: () => startTransition(() => signOut()) },
  ];
}

/**
 * Cadre du contenu. Les écrans refaits avec le design system gèrent leurs marges (en-tête
 * pleine largeur) ; les autres gardent l'ancien cadre jusqu'à leur migration.
 */
export function ContentFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ds = DS_ROUTES.some((r) => (r === "/" ? pathname === "/" : isActive(pathname, r)));
  if (ds) {
    return (
      <main
        className="relative min-w-0 pb-[var(--content-pb)] md:pb-0 md:pl-[256px]"
        // barre d'onglets : hauteur + écart avec le bas + space-8 de respiration
        style={{ "--content-pb": "calc(var(--tabbar-height) + var(--space-4) + var(--space-8) + env(safe-area-inset-bottom, 0px))" } as CSSProperties}
      >
        {children}
      </main>
    );
  }
  return (
    <main className="relative min-w-0 px-4 pt-5 pb-32 md:pt-7 md:pr-8 md:pb-10 md:pl-[276px]">
      <MoreMenu />
      <div className="mx-auto max-w-6xl">{children}</div>
    </main>
  );
}

/** Bouton ≡ (mobile) ouvrant le menu « Plus », pour les écrans pas encore refaits. */
export function MoreMenu() {
  const [open, setOpen] = useState(false);
  const items: NavItem[] = [...MORE, { href: "/parametres", label: "Paramètres", icon: SlidersHorizontal }];
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute top-4 right-3 z-10 flex size-11 items-center justify-center rounded-full text-n-700 hover:bg-n-200 active:bg-n-200 md:hidden"
        aria-label="Plus"
      >
        <MenuIcon size={22} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <nav className="-mx-2 flex flex-col" aria-label="Plus">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={clsx("flex min-h-12 items-center gap-3 rounded-lg px-2 font-semibold hover:bg-n-100")}
            >
              <item.icon size={19} className="text-n-600" />
              {item.label}
            </Link>
          ))}
          <form action={signOut} className="mt-2 border-t border-divider pt-2">
            <SubmitButton
              className="flex min-h-12 w-full items-center gap-3 rounded-lg px-2 font-semibold text-danger-700 hover:bg-danger-100"
              pendingChildren="Déconnexion…"
            >
              <LogOut size={19} />
              Se déconnecter
            </SubmitButton>
          </form>
        </nav>
      </Modal>
    </>
  );
}
