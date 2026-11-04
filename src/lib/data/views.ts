import "server-only";
import { cookies } from "next/headers";
import { MONTH_START_COOKIE } from "@/lib/theme";
import { addMonths, isValidMonthKey, monthKeyOf, monthPeriod, todayIso, type MonthKey } from "@/lib/domain/dates";
import { carryOverFrom, computeBudgets, type BudgetOverview } from "@/lib/domain/budgets";
import type { Profile, Transaction } from "@/lib/domain/types";
import { getAccounts, getBudgets, getCategories, getProfile, getTransactions } from "./queries";

/** Mois affiché : celui de l'URL s'il est valide et pas dans le futur, sinon le mois en cours. */
export function resolveMonth(param: string | undefined, startDay: number): { month: MonthKey; current: MonthKey } {
  const current = monthKeyOf(todayIso(), startDay);
  const month = isValidMonthKey(param) && param <= current ? param : current;
  return { month, current };
}

/**
 * Lecture d'un écran dont les bornes dépendent du jour de début de mois, sans attendre
 * le profil : `load` part tout de suite avec le jour deviné (cookie, sinon le 1er), en même
 * temps que le profil. Si le profil dit autre chose (rare : réglage changé sur un autre
 * appareil), `load` est relancé avec le bon jour. Le résultat est donc toujours exact.
 */
export async function withStartDay<T>(load: (startDay: number) => Promise<T>): Promise<{ profile: Profile; data: T }> {
  const hint = Number((await cookies()).get(MONTH_START_COOKIE)?.value);
  const guess = Number.isInteger(hint) && hint >= 1 && hint <= 28 ? hint : 1;
  const early = load(guess);
  early.catch(() => {}); // erreur gérée plus bas si ce résultat est retenu
  const profile = await getProfile();
  if (profile.monthStartDay === guess) return { profile, data: await early };
  return { profile, data: await load(profile.monthStartDay) };
}

/** Lance une lecture dont le résultat ne sera peut-être pas utilisé (sans rejet non géré). */
function speculative<T>(p: Promise<T>): Promise<T> {
  p.catch(() => {});
  return p;
}

/**
 * Budgets d'un mois, report du mois précédent inclus si l'option est active.
 * Avec `startDay` (jour deviné), les transactions sont lues en même temps que le profil.
 */
export async function getBudgetOverview(month: MonthKey, monthTxs?: Transaction[], startDay?: number): Promise<BudgetOverview> {
  const periods = (day: number) => ({ period: monthPeriod(month, day), prev: monthPeriod(addMonths(month, -1), day) });
  const guessed = startDay !== undefined ? periods(startDay) : null;
  const early = guessed && {
    txs: monthTxs ? null : speculative(getTransactions({ from: guessed.period.start, to: guessed.period.end })),
    prev: speculative(getTransactions({ from: guessed.prev.start, to: guessed.prev.end })),
  };
  const [profile, budgets, categories, accounts] = await Promise.all([
    getProfile(),
    getBudgets(),
    getCategories(),
    getAccounts(),
  ]);
  const reuse = early && profile.monthStartDay === startDay ? early : null;
  const { period, prev } = periods(profile.monthStartDay);
  // mois affiché et, si le report est actif, mois précédent : lus en parallèle
  const [txs, prevTxs] = await Promise.all([
    monthTxs ?? reuse?.txs ?? getTransactions({ from: period.start, to: period.end }),
    profile.budgetCarryOver ? (reuse?.prev ?? getTransactions({ from: prev.start, to: prev.end })) : null,
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
