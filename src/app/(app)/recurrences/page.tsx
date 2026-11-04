import { getRecurrences, getTransactions } from "@/lib/data/queries";
import { withStartDay } from "@/lib/data/views";
import { addMonths, monthKeyOf, monthPeriod, todayIso } from "@/lib/domain/dates";
import { buildOccurrences, isActiveOn, monthlyEquivalentCents, occurrenceWindow } from "@/lib/domain/recurrences";
import { PageHeader } from "@/components/ui/primitives";
import { RecurrencesManager } from "./recurrences-manager";

export const metadata = { title: "Récurrences" };

export default async function RecurrencesPage() {
  const today = todayIso();
  // mois en cours + 2 mois à venir
  const windowOf = (day: number) => {
    const current = monthKeyOf(today, day);
    const from = monthPeriod(current, day).start;
    const to = monthPeriod(addMonths(current, 2), day).end;
    return { from, to, range: occurrenceWindow(from, to) };
  };
  // profil, récurrences et transactions en même temps (jour de début de mois deviné puis vérifié)
  const {
    profile,
    data: [recurrences, txs],
  } = await withStartDay((day) => {
    const { range } = windowOf(day);
    return Promise.all([getRecurrences(), getTransactions({ from: range.from, to: range.to })]);
  });
  const { from, to } = windowOf(profile.monthStartDay);
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
