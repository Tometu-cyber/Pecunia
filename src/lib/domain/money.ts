/**
 * Montants : toujours manipulés en centimes entiers. Les conversions texte ↔ centimes
 * se font ici, sans passer par des flottants pour la saisie.
 */

const MINUS = "−"; // « − » typographique, comme dans les maquettes

const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const euroCompactFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export type SignDisplay = "auto" | "always" | "never";

function applySign(formattedAbs: string, cents: number, sign: SignDisplay): string {
  if (sign === "never" || cents === 0) return formattedAbs;
  if (cents < 0) return MINUS + formattedAbs;
  return sign === "always" ? "+" + formattedAbs : formattedAbs;
}

/** 105000 → « 1 050,00 € » ; avec sign="always" → « +1 050,00 € » */
export function formatCents(cents: number, sign: SignDisplay = "auto"): string {
  return applySign(euroFormatter.format(Math.abs(cents) / 100), cents, sign);
}

/** 325340 → « 3 253 € » (KPI) */
export function formatCentsCompact(cents: number, sign: SignDisplay = "auto"): string {
  return applySign(euroCompactFormatter.format(Math.round(Math.abs(cents) / 100)), cents, sign);
}

/** 105000 → « 1050,00 » (valeur éditable, sans symbole ni séparateur de milliers) */
export function centsToInput(cents: number): string {
  const abs = Math.abs(cents);
  const euros = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, "0");
  return `${cents < 0 ? "-" : ""}${euros},${rest}`;
}

/**
 * Filtre la frappe en temps réel : seuls chiffres, virgule, point et espace sont gardés
 * (le signe « - » seulement si allowNegative).
 */
export function sanitizeAmountInput(raw: string, allowNegative = false): string {
  const kept = raw.replace(allowNegative ? /[^0-9,.\s-]/g : /[^0-9,.\s]/g, "");
  if (!allowNegative) return kept;
  // un seul « - », en tête
  const negative = kept.trimStart().startsWith("-");
  return (negative ? "-" : "") + kept.replace(/-/g, "");
}

/**
 * « 1 050,00 » / « 1050.5 » / « 12 » → centimes. Renvoie null si illisible.
 * Plus de 2 décimales → null (pas d'arrondi silencieux).
 */
export function parseAmountToCents(input: string): number | null {
  const compact = input.replace(/[\s  ]/g, "").replace(",", ".");
  const match = /^(-)?(\d+)(?:\.(\d{0,2}))?$/.exec(compact);
  if (!match) return null;
  const [, minus, intPart, frac = ""] = match;
  const cents = Number(intPart) * 100 + Number(frac.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents)) return null;
  return minus ? -cents : cents;
}

/**
 * Recherche par montant : la saisie est-elle un début de montant qui correspond ?
 * « 10 » → 10,00 à 10,99 € (pas 100 ni 210) ; « 10,5 » → 10,50 à 10,59 € ; « 10,50 » → 10,50 €.
 * Le signe est ignoré (dépense ou entrée). Renvoie false si la saisie n'est pas un montant.
 */
export function matchesAmountQuery(cents: number, query: string): boolean {
  const q = query.replace(/[\s\u00a0\u202f€+\-−]/g, "").replace(".", ",");
  const match = /^(\d+)(?:,(\d{0,2}))?$/.exec(q);
  if (!match) return false;
  const [, euros, frac] = match;
  const abs = Math.abs(cents);
  if (Math.floor(abs / 100) !== Number(euros)) return false;
  if (!frac) return true;
  return String(abs % 100).padStart(2, "0").startsWith(frac);
}

/** Pourcentage lisible : 0.3815 → « 38,1 % » */
export function formatPercent(ratio: number, fractionDigits = 1): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(ratio);
}
