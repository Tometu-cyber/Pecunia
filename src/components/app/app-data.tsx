"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { MONTH_START_COOKIE } from "@/lib/theme";
import type { Account, Category, ForecastItem, PlaceMemoryEntry, Profile, Recurrence } from "@/lib/domain/types";

export interface AppDataInput {
  profile: Profile;
  accounts: Account[];
  categories: Category[];
  /** Solde courant par id de compte, en centimes */
  balances: Record<string, number>;
  placeMemory: PlaceMemoryEntry[];
  recurrences: Recurrence[];
  /** Dépenses / revenus ponctuels prévus, non encore liés */
  forecastItems: ForecastItem[];
}

export interface AppData extends AppDataInput {
  activeAccounts: Account[];
  activeCategories: Category[];
  accountById: Map<string, Account>;
  categoryById: Map<string, Category>;
  netWorthCents: number;
}

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ value, children }: { value: AppDataInput; children: ReactNode }) {
  const data = useMemo<AppData>(() => {
    const activeAccounts = value.accounts.filter((a) => !a.archivedAt);
    return {
      ...value,
      activeAccounts,
      activeCategories: value.categories.filter((c) => !c.archivedAt),
      accountById: new Map(value.accounts.map((a) => [a.id, a])),
      categoryById: new Map(value.categories.map((c) => [c.id, c])),
      netWorthCents: activeAccounts.reduce((sum, a) => sum + (value.balances[a.id] ?? 0), 0),
    };
  }, [value]);
  // cookie du jour de début de mois à jour (voir MONTH_START_COOKIE) : les pages suivantes
  // lisent leurs transactions sans attendre le profil
  const startDay = value.profile.monthStartDay;
  useEffect(() => {
    if (!document.cookie.split("; ").includes(`${MONTH_START_COOKIE}=${startDay}`))
      document.cookie = `${MONTH_START_COOKIE}=${startDay}; path=/; max-age=31536000; samesite=lax`;
  }, [startDay]);
  return <AppDataContext.Provider value={data}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppData {
  const data = useContext(AppDataContext);
  if (!data) throw new Error("useAppData doit être utilisé sous <AppDataProvider>");
  return data;
}

