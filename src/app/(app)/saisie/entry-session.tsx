"use client";

import { useState } from "react";
import { QuickEntryForm } from "@/components/entry/quick-entry-form";
import { useAppData } from "@/components/app/app-data";
import { Card, CardHeader } from "@/components/ui/primitives";
import { formatCents } from "@/lib/domain/money";
import { shortDate } from "@/lib/domain/dates";

interface SessionEntry {
  key: number;
  label: string;
  amount: string;
  accountName: string;
  categoryName: string | null;
  date: string;
}

/** Écran Saisie web : formulaire rapide + « Cette session » + soldes à jour. */
export function EntrySession() {
  const { activeAccounts, balances } = useAppData();
  const [entries, setEntries] = useState<SessionEntry[]>([]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Card>
        <QuickEntryForm
          variant="page"
          onCreated={(e) =>
            setEntries((list) => [
              { key: Date.now(), label: e.label, amount: e.amount, accountName: e.accountName, categoryName: e.categoryName, date: e.date },
              ...list,
            ])
          }
        />
      </Card>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader title="Cette session" action={<span className="text-foot text-label-secondary">{entries.length} saisie{entries.length > 1 ? "s" : ""}</span>} />
          {entries.length === 0 ? (
            <p className="text-body text-label-secondary">Les mouvements validés apparaîtront ici.</p>
          ) : (
            <ul className="divide-y-[0.5px] divide-separator">
              {entries.map((e) => (
                <li key={e.key} className="flex min-h-11 items-center justify-between gap-2 py-2 text-body">
                  <div className="min-w-0">
                    <p className="truncate">{e.label}</p>
                    <p className="text-sub text-label-secondary">
                      {[shortDate(e.date), e.categoryName, e.accountName].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums">{e.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardHeader title="Soldes à jour" />
          <ul className="flex flex-col gap-2 text-body">
            {activeAccounts.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: a.color }} />
                  {a.name}
                </span>
                <span className="font-semibold tabular-nums">{formatCents(balances[a.id] ?? 0)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <p className="px-1 text-foot text-label-secondary">
          Raccourcis : <strong>Entrée</strong> valide · <strong>Tab</strong> champ suivant · catégorie et compte repris du dernier
          passage au même endroit.
        </p>
      </div>
    </div>
  );
}
