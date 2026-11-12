"use client";

import { clsx } from "clsx";
import { Check, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { setOccurrenceDone } from "@/lib/data/planning-actions";
import { monthKeyOf, monthLabel, shortDate } from "@/lib/domain/dates";
import { formatCents } from "@/lib/domain/money";
import { FREQUENCY_LABELS, signedRecurrenceCents, type Occurrence } from "@/lib/domain/recurrences";
import { shortAccountName } from "@/lib/domain/accounts";
import type { Recurrence } from "@/lib/domain/types";
import { useAppData } from "@/components/app/app-data";
import { RecurrenceFormModal } from "@/components/planning/recurrence-form";
import { IconBadge } from "@/components/ui/icons";
import { Amount } from "@/components/ui/money";
import { Button, Card, CardHeader, EmptyState } from "@/components/ui/primitives";
import { Spinner } from "@portail/ui";
import { useToast } from "@/components/ui/toasts";

export function RecurrencesManager({
  recurrences,
  occurrences,
  subscriptionsMonthlyCents,
  subscriptionsCount,
  startDay,
  today,
}: {
  recurrences: Recurrence[];
  occurrences: Occurrence[];
  subscriptionsMonthlyCents: number;
  subscriptionsCount: number;
  startDay: number;
  today: string;
}) {
  const { accountById, categoryById } = useAppData();
  const toast = useToast();
  const [editing, setEditing] = useState<{ recurrence: Recurrence | null; key: number } | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const byMonth = new Map<string, Occurrence[]>();
  for (const o of occurrences) {
    const key = monthKeyOf(o.date, startDay);
    byMonth.set(key, [...(byMonth.get(key) ?? []), o]);
  }

  function toggle(o: Occurrence) {
    setBusyKey(o.key);
    startTransition(async () => {
      const r = await setOccurrenceDone(o.recurrence.id, o.date, o.status !== "done", o.transaction?.id ?? null);
      startTransition(() => {
        setBusyKey(null);
        if (!r.ok) toast(r.error, "error");
      });
    });
  }

  const accountLabel = (r: Recurrence) => {
    const from = accountById.get(r.accountId);
    const to = r.toAccountId ? accountById.get(r.toAccountId) : undefined;
    return r.type === "transfer" && from && to ? `${shortAccountName(from)} → ${shortAccountName(to)}` : from ? shortAccountName(from) : "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sub font-semibold text-label-secondary">Abonnements par mois</p>
          <p className="mt-1 text-stat">{formatCents(subscriptionsMonthlyCents)}</p>
          <p className="text-foot text-label-secondary">
            {subscriptionsCount} abonnement{subscriptionsCount > 1 ? "s" : ""} actif{subscriptionsCount > 1 ? "s" : ""}
          </p>
        </Card>
        <Card>
          <p className="text-sub font-semibold text-label-secondary">Coût annuel</p>
          <p className="mt-1 text-stat">{formatCents(subscriptionsMonthlyCents * 12)}</p>
          <p className="text-foot text-label-secondary">Abonnements × 12</p>
        </Card>
        <Card className="flex items-center justify-center">
          <Button variant="primary" onClick={() => setEditing({ recurrence: null, key: Date.now() })}>
            <Plus size={18} strokeWidth={2.2} aria-hidden /> Nouvelle récurrence
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="!p-0">
          <div className="p-4 pb-2">
            <CardHeader title="Échéances à venir" />
            <p className="-mt-2 text-foot text-label-secondary">
              Coche une échéance quand elle est réalisée. Les échéances déjà saisies ou importées sont reconnues automatiquement (libellé et montant proches).
            </p>
          </div>
          {occurrences.length === 0 ? (
            <div className="p-4">
              <EmptyState>Aucune échéance sur les 3 prochains mois. Crée une récurrence pour ton loyer, tes abonnements ou ton salaire.</EmptyState>
            </div>
          ) : (
            [...byMonth.entries()].map(([month, list]) => (
              <section key={month}>
                <h3 className="border-y-[0.5px] border-separator bg-fill-tertiary px-4 py-1.5 text-foot font-semibold text-label-secondary">
                  {monthLabel(month)}
                </h3>
                <ul className="divide-y-[0.5px] divide-separator">
                  {list.map((o) => {
                    const r = o.recurrence;
                    const done = o.status === "done";
                    const late = !done && o.date < today;
                    const category = r.categoryId ? categoryById.get(r.categoryId) : undefined;
                    return (
                      <li key={o.key} className={clsx("flex min-h-11 items-center gap-3 px-4 py-2", done && "bg-fill-tertiary")}>
                        <button
                          type="button"
                          onClick={() => toggle(o)}
                          disabled={pending}
                          aria-pressed={done}
                          aria-label={done ? "Repasser en prévue" : "Marquer comme réalisée"}
                          className={clsx(
                            // case ronde façon Rappels : 28 px visibles, 44 px de zone tactile sur mobile
                            "relative flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors before:absolute before:-inset-2.5 before:content-[''] md:size-6 md:before:hidden",
                            done
                              ? "border-finances bg-finances text-on-finances"
                              : busyKey === o.key
                                ? // en cours : le spinner reste visible, même sans survol (téléphone)
                                  "border-finances text-finances-text"
                                : "border-gray-2 text-transparent hover:border-finances hover:text-finances-text",
                          )}
                        >
                          {busyKey === o.key ? <Spinner size={15} className="text-current" /> : <Check size={15} strokeWidth={3} aria-hidden />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-body">{r.label}</p>
                          <p className="truncate text-sub text-label-secondary">
                            {shortDate(o.date)} · {accountLabel(r)}
                            {category && ` · ${category.name}`}
                            {done ? (o.matched ? " · réalisée (reconnue)" : " · réalisée") : late ? " · en retard" : " · prévue"}
                          </p>
                        </div>
                        <Amount cents={r.type === "transfer" ? r.amountCents : signedRecurrenceCents(r)} type={r.type} neutral={r.type === "transfer"} className="text-body" />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </Card>

        <Card className="!p-0 self-start">
          <div className="p-4 pb-2">
            <CardHeader title={`Récurrences · ${recurrences.length}`} />
          </div>
          {recurrences.length === 0 ? (
            <p className="px-4 pb-4 text-body text-label-secondary">Aucune récurrence pour l&apos;instant.</p>
          ) : (
            <ul className="pt-list-inset">
              {recurrences.map((r) => {
                const category = r.categoryId ? categoryById.get(r.categoryId) : undefined;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setEditing({ recurrence: r, key: Date.now() })}
                      className="flex min-h-11 w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-fill-tertiary active:bg-fill-secondary md:py-2"
                    >
                      <IconBadge
                        icon={r.type === "transfer" ? "transfer" : (category?.icon ?? "repeat")}
                        color={r.type === "transfer" ? "var(--gray)" : (category?.color ?? "var(--gray)")}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 truncate text-body">
                          {r.label}
                          {r.isSubscription && (
                            <span className="rounded-full bg-finances-bg px-2 py-0.5 text-foot font-semibold text-finances-text">Abonnement</span>
                          )}
                        </p>
                        <p className="truncate text-sub text-label-secondary">
                          {FREQUENCY_LABELS[r.frequency]}
                          {r.frequency !== "weekly" && `, le ${r.dueDay}`} · {accountLabel(r)}
                          {r.endDate && ` · jusqu'au ${shortDate(r.endDate)}`}
                        </p>
                      </div>
                      <span className="text-body font-semibold tabular-nums">{formatCents(r.amountCents)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {editing && (
        <RecurrenceFormModal key={editing.key} open recurrence={editing.recurrence} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
