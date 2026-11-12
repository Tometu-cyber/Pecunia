"use client";

import { clsx } from "clsx";
import { useState, useTransition, type ReactNode } from "react";
import { saveBudget, updateProfile } from "@/lib/data/actions";
import { centsToInput, formatCents, parseAmountToCents, sanitizeAmountInput } from "@/lib/domain/money";
import type { BudgetMode } from "@/lib/domain/types";
import { Button, FieldError, Input, Label, Segmented } from "@/components/ui/primitives";
import { Toggle, Modal, Spinner } from "@portail/ui";
import { useToast } from "@/components/ui/toasts";

/** Ligne cliquable ouvrant l'édition du budget d'une catégorie (montant fixe ou % du revenu). */
export function BudgetEditButton({
  categoryId,
  categoryName,
  mode: initialMode,
  amountCents,
  referenceIncomeCents,
  compact = false,
  children,
}: {
  categoryId: string;
  categoryName: string;
  mode: BudgetMode;
  /** Montant en centimes, ou pourcentage × 100 en mode percent ; null = pas de budget */
  amountCents: number | null;
  referenceIncomeCents: number;
  compact?: boolean;
  children: ReactNode;
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<BudgetMode>(initialMode);
  const [value, setValue] = useState(amountCents === null ? "" : centsToInput(amountCents).replace(/,00$/, ""));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<"save" | "delete" | null>(null);

  const parsed = parseAmountToCents(value);
  const preview = mode === "percent" && parsed !== null ? Math.round((referenceIncomeCents * parsed) / 10000) : null;

  function save(amount: string) {
    setError(null);
    setAction(amount ? "save" : "delete");
    startTransition(async () => {
      const r = await saveBudget({ categoryId, mode, amount });
      startTransition(() => {
        if (!r.ok) return setError(r.error);
        toast(amount ? `Budget ${categoryName} enregistré` : `Budget ${categoryName} supprimé`);
        setOpen(false);
      });
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          "w-full text-left",
          compact
            ? "min-h-11 rounded-full bg-fill-tertiary px-4 text-[15px] tracking-[-0.23px] hover:bg-fill-secondary md:min-h-7 md:px-3 md:text-[13px]"
            : "px-4 py-3 hover:bg-fill-tertiary active:bg-fill-secondary",
        )}
      >
        {children}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Budget - ${categoryName}`}
        footer={
          <>
            {amountCents !== null && (
              <Button onClick={() => save("")} loading={pending && action === "delete"} disabled={pending} className="mr-auto">
                Supprimer le budget
              </Button>
            )}
            <Button variant="primary" onClick={() => save(value)} loading={pending && action === "save"} disabled={parsed === null || pending}>
              Enregistrer
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Segmented
            value={mode}
            onChange={setMode}
            className="w-full"
            options={[
              { value: "fixed", label: "Montant fixe" },
              { value: "percent", label: "% du salaire" },
            ]}
          />
          <div>
            <Label htmlFor="budget-value">{mode === "fixed" ? "Montant mensuel (€)" : "Pourcentage du revenu de référence"}</Label>
            <Input id="budget-value" inputMode="decimal" value={value} onChange={(e) => setValue(sanitizeAmountInput(e.target.value))} />
            {preview !== null && (
              <p className="mt-1.5 text-foot text-label-secondary">
                Soit {formatCents(preview)} / mois sur un revenu de {formatCents(referenceIncomeCents)}.
              </p>
            )}
          </div>
          <p className="text-foot text-label-secondary">
            S&apos;applique dès le mois en cours. Les comptes concernés se règlent dans l&apos;écran Catégories.
          </p>
          <FieldError>{error}</FieldError>
        </div>
      </Modal>
    </>
  );
}

/** Report du reste + revenu de référence (base des budgets en %). */
export function BudgetSettings({
  carryOver,
  carryOverCents,
  referenceIncomeCents,
}: {
  carryOver: boolean;
  carryOverCents: number;
  referenceIncomeCents: number;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [income, setIncome] = useState(centsToInput(referenceIncomeCents));
  const [error, setError] = useState<string | null>(null);
  const [what, setWhat] = useState<"carry" | "income" | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 text-body">
        <span>
          <span id="carry-label" className="block">Reporter le reste</span>
          <span className="text-sub text-label-secondary">
            {carryOver ? `${formatCents(carryOverCents)} reportés du mois précédent` : "Ajoute le reliquat du mois précédent"}
          </span>
        </span>
        <span className="flex items-center gap-2">
          {pending && what === "carry" && <Spinner size={14} label="Enregistrement" />}
          <Toggle
            ariaLabel="Reporter le reste"
            checked={carryOver}
            disabled={pending}
            onChange={(on) => {
              setWhat("carry");
              startTransition(async () => {
                const r = await updateProfile({ budgetCarryOver: on });
                startTransition(() => {
                  if (!r.ok) toast(r.error, "error");
                });
              });
            }}
          />
        </span>
      </div>
      <form
        className="border-t-[0.5px] border-separator pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          setWhat("income");
          startTransition(async () => {
            const r = await updateProfile({ referenceIncome: income });
            startTransition(() => {
              if (!r.ok) return setError(r.error);
              toast("Revenu de référence enregistré");
            });
          });
        }}
      >
        <Label htmlFor="ref-income">Revenu de référence (budgets en %)</Label>
        <div className="flex gap-2">
          <Input id="ref-income" inputMode="decimal" value={income} onChange={(e) => setIncome(sanitizeAmountInput(e.target.value))} />
          <Button type="submit" loading={pending && what === "income"} disabled={pending}>
            OK
          </Button>
        </div>
        <FieldError>{error}</FieldError>
      </form>
    </div>
  );
}
