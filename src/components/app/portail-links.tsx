"use client";

/**
 * Liens du design system (@portail/ui) : les composants client avec `href` (TabBar, Sidebar,
 * Menu…) naviguent avec le Link de Next.js. Rendu une fois dans le layout racine.
 * Dans un composant serveur, passer `linkAs={Link}` au composant.
 */
import Link from "next/link";
import { setLinkComponent } from "@portail/ui";

setLinkComponent(Link);

export function PortailLinks() {
  return null;
}
