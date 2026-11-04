export const THEME_COOKIE = "pecunia-theme";
export type Theme = "light" | "dark";

/**
 * Jour de début du mois budgétaire, recopié dans un cookie : le serveur s'en sert pour
 * lancer la lecture des transactions sans attendre le profil (il vérifie ensuite).
 */
export const MONTH_START_COOKIE = "pecunia-month-start";
