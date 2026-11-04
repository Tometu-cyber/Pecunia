import "server-only";
import { addMonths, isValidMonthKey, monthKeyOf, monthPeriod, todayIso, type MonthKey } from "@/lib/domain/dates";
import { carryOverFrom, computeBudgets, type BudgetOverview } from "@/lib/domain/budgets";
import type { Transaction } from "@/lib/domain/types";
import { getAccounts, getBudgets, getCategories, getProfile, getTransactions } from "./queries";

/** Mois affiché : celui de l'URL s'il est valide et pas dans le futur, sinon le mois en cours. */
export function resolveMonth(param: string | undefined, startDay: number): { month: MonthKey; current: MonthKey } {
  const current = monthKeyOf(todayIso(), startDay);
  const month = isValidMonthKey(param) && param <= current ? param : current;
  return { month, current };
}

/** Budgets d'un mois, report du mois précédent inclus si l'option est active. */
export async function getBudgetOverview(month: MonthKey, monthTxs?: Transaction[]): Promise<BudgetOverview> {
  const [profile, budgets, categories, accounts] = await Promise.all([
    getProfile(),
    getBudgets(),
    getCategories(),
    getAccounts(),
  ]);
  const period = monthPeriod(month, profile.monthStartDay);
  const prev = monthPeriod(addMonths(month, -1), profile.monthStartDay);
  // mois affiché et, si le report est actif, mois précédent : lus en parallèle
  const [txs, prevTxs] = await Promise.all([
    monthTxs ?? getTransactions({ from: period.start, to: period.end }),
    profile.budgetCarryOver ? getTransactions({ from: prev.start, to: prev.end }) : null,
  ]);
  const base = { budgets, categories, accounts, referenceIncomeCents: profile.referenceIncomeCents };
  const carryOverCents = prevTxs ? carryOverFrom(computeBudgets({ ...base, txs: prevTxs })) : 0;
  return computeBudgets({ ...base, txs, carryOverCents });
}

export function withParams(path: string, params: Record<string, string | null | undefined>): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) search.set(k, v);
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}
