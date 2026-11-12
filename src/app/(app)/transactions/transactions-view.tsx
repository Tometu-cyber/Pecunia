"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppData } from "@/components/app/app-data";
import { Chip, EmptyState, Segmented, Select } from "@/components/ui/primitives";
import { Amount } from "@/components/ui/money";
import { dayLabel } from "@/lib/domain/dates";
import { formatCents, matchesAmountQuery } from "@/lib/domain/money";
import { shortAccountName } from "@/lib/domain/accounts";
import { groupByDay, signedTotal } from "@/lib/domain/stats";
import type { Transaction } from "@/lib/domain/types";
import { TransactionRow } from "@/components/transactions/transaction-row";
import { deleteTransaction } from "@/lib/data/actions";
import { EditTransactionModal } from "@/components/transactions/edit-transaction-modal";
import { DeleteSwipe } from "@/components/ui/delete-swipe";

type TypeFilter = "all" | "out" | "in" | "transfer";

export function TransactionsView({ transactions, initialAccount }: { transactions: Transaction[]; initialAccount: string | null }) {
  const { activeAccounts, activeCategories, categoryById, accountById } = useAppData();
  const [search, setSearch] = useState("");
  const [accountId, setAccountId] = useState<string | null>(initialAccount);
  const [type, setType] = useState<TypeFilter>("all");
  const [categoryId, setCategoryId] = useState<string>("");
  const [editing, setEditing] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("fr-FR");
    return transactions.filter((t) => {
      // En vue « tous comptes », un virement n'apparaît qu'une fois (ligne source)
      if (accountId ? t.accountId !== accountId : t.type === "transfer" && t.amountCents > 0) return false;
      if (type === "out" && t.type !== "out") return false;
      if (type === "in" && t.type !== "in" && t.type !== "interest") return false;
      if (type === "transfer" && t.type !== "transfer") return false;
      if (categoryId && t.categoryId !== categoryId) return false;
      // un lieu, une note, ou un montant (« 10 » trouve 10,00 à 10,99 €)
      if (q && !`${t.place ?? ""} ${t.note ?? ""}`.toLocaleLowerCase("fr-FR").includes(q) && !matchesAmountQuery(t.amountCents, q)) return false;
      return true;
    });
  }, [transactions, search, accountId, type, categoryId]);

  const total = signedTotal(filtered, accountId);
  const groups = groupByDay(filtered);

  return (
    <>
      <div className="flex flex-col gap-3 md:rounded-lg md:bg-bg-grouped-secondary md:p-4 md:shadow-card">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
          <label className="relative block">
            <Search size={16} strokeWidth={2} className="absolute top-1/2 left-3 -translate-y-1/2 text-label-secondary md:left-2.5 md:size-3.5" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Lieu, note ou montant"
              className="block min-h-11 w-full rounded-full border border-transparent bg-fill-tertiary pr-3 pl-9 text-[17px] text-label placeholder:text-label-tertiary focus:border-finances focus:bg-bg-tertiary focus:shadow-[0_0_0_4px_var(--finances-bg)] focus:outline-none md:min-h-7 md:pl-8 md:text-[13px]"
            />
          </label>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} aria-label="Catégorie" className="hidden md:flex">
            <option value="">Toutes les catégories</option>
            {activeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <Segmented
          value={type}
          onChange={setType}
          className="w-full md:w-auto md:self-start"
          options={[
            { value: "all", label: "Tout" },
            { value: "out", label: "Sorties" },
            { value: "in", label: "Entrées" },
            { value: "transfer", label: "Virements" },
          ]}
        />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          <Chip active={!accountId} onClick={() => setAccountId(null)}>
            Tous comptes
          </Chip>
          {activeAccounts.map((a) => (
            <Chip key={a.id} active={accountId === a.id} color={a.color} onClick={() => setAccountId(a.id)}>
              {shortAccountName(a)}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg bg-finances-bg px-4 py-3.5">
        <p className="text-body text-label">
          <strong>{filtered.length}</strong> transaction{filtered.length > 1 ? "s" : ""}
          {!accountId && <span className="hidden md:inline"> · virements internes neutres dans le total</span>}
        </p>
        <p className={`font-rounded text-[22px] leading-7 font-bold tabular-nums ${total >= 0 ? "text-finances-text" : "text-label"}`}>
          {formatCents(total, total > 0 ? "always" : "auto")}
        </p>
      </div>

      {groups.length === 0 ? (
        <EmptyState>Aucune transaction ne correspond à ces filtres.</EmptyState>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map((g) => {
            const dayTotal = signedTotal(g.items, accountId);
            return (
              <section key={g.date}>
                <header className="mx-4 mb-1.5 flex items-baseline justify-between gap-3 text-foot font-semibold text-label-secondary">
                  <h2>{dayLabel(g.date)}</h2>
                  <Amount cents={dayTotal} className="!font-semibold !text-label-secondary" />
                </header>
                <ul className="pt-list-inset overflow-hidden rounded-lg bg-bg-grouped-secondary shadow-card">
                  {g.items.map((t) => (
                    <li key={t.id}>
                      <DeleteSwipe
                        label={`Supprimer ${t.place || "la transaction"}`}
                        successMessage={t.type === "transfer" ? "Virement supprimé" : "Transaction supprimée"}
                        onDelete={() => deleteTransaction(t.id)}
                      >
                        <TransactionRow
                          tx={t}
                          consolidated={!accountId}
                          category={t.categoryId ? categoryById.get(t.categoryId) : undefined}
                          account={accountById.get(t.accountId)}
                          counterpart={t.counterpartAccountId ? accountById.get(t.counterpartAccountId) : undefined}
                          onClick={() => setEditing(t)}
                        />
                      </DeleteSwipe>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <EditTransactionModal tx={editing} transactions={transactions} onClose={() => setEditing(null)} />
    </>
  );
}
