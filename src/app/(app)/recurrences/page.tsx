import { getProfile, getRecurrences, getTransactions } from "@/lib/data/queries";
import { addMonths, monthKeyOf, monthPeriod, todayIso } from "@/lib/domain/dates";
import { buildOccurrences, isActiveOn, monthlyEquivalentCents, occurrenceWindow } from "@/lib/domain/recurrences";
import { PageHeader } from "@/components/ui/primitives";
import { RecurrencesManager } from "./recurrences-manager";

export const metadata = { title: "Récurrences" };

export default async function RecurrencesPage() {
  const profile = await getProfile();
  const today = todayIso();
  const current = monthKeyOf(today, profile.monthStartDay);
  // mois en cours + 2 mois à venir
  const from = monthPeriod(current, profile.monthStartDay).start;
  const to = monthPeriod(addMonths(current, 2), profile.monthStartDay).end;
  const range = occurrenceWindow(from, to);
  const [recurrences, txs] = await Promise.all([getRecurrences(), getTransactions({ from: range.from, to: range.to })]);
  const occurrences = buildOccurrences(recurrences, txs, from, to);

  const subscriptions = recurrences.filter((r) => r.isSubscription && isActiveOn(r, today));
  const monthlyCents = subscriptions.reduce((s, r) => s + monthlyEquivalentCents(r), 0);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader kicker="Gestion" title="Récurrences" />
      <RecurrencesManager
        recurrences={recurrences}
        occurrences={occurrences}
        subscriptionsMonthlyCents={monthlyCents}
        subscriptionsCount={subscriptions.length}
        startDay={profile.monthStartDay}
        today={today}
      />
    </div>
  );
}
