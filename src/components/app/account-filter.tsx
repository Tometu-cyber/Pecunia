"use client";

/** Filtre de compte (Tous, Courant, Livret A…), en lien avec l'URL (?compte=). */
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { startNavigationProgress } from "@/components/ui/navigation-progress";
import { Menu } from "@/components/ui/menu";
import { SegmentedControl } from "@/components/ui/segmented-control";

export interface FilterOption {
  id: string;
  label: string;
  href: string;
}

/** Au-delà de 4 choix (Tous + 3 comptes), le contrôle segmenté laisse la place à un menu. */
const MAX_SEGMENTS = 4;

export function AccountFilter({
  options,
  value,
  size = "regular",
  full,
  label = "Compte",
}: {
  options: FilterOption[];
  value: string;
  size?: "regular" | "small";
  full?: boolean;
  /** Nom du groupe pour les lecteurs d'écran */
  label?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  // le choix bouge tout de suite ; la page suit quand les données arrivent
  const [target, setTarget] = useState<string | null>(null);
  const shown = pending && target ? target : value;
  const go = (id: string) => {
    const href = options.find((o) => o.id === id)?.href;
    if (!href || id === value) return;
    setTarget(id);
    startNavigationProgress();
    startTransition(() => router.push(href, { scroll: false }));
  };
  if (options.length > MAX_SEGMENTS) {
    return <Menu label={label} size={size} value={value} items={options.map((o) => ({ id: o.id, label: o.label, href: o.href }))} />;
  }
  return <SegmentedControl label={label} size={size} full={full} value={shown} onChange={go} items={options.map((o) => ({ id: o.id, label: o.label }))} />;
}
