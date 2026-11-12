"use client";

/**
 * En-tête d'un écran de Pecunia (design system, AppHeader) :
 * - mobile : grand titre (avec une petite ligne verte au-dessus), barre fixée en haut avec
 *   le retour éventuel, les actions mobiles et le menu « … » de navigation secondaire ;
 * - ordi : barre d'outils (titre, sous-titre, contrôle au centre, actions à droite).
 * Les actions sont des éléments déjà rendus (liens, boutons, composants client).
 */
import type { ReactNode } from "react";
import { useMoreMenuItems } from "./navigation";
import { AppHeader, Menu } from "@portail/ui";
import { PECUNIA_APP } from "@/components/ui/app";

export interface ScreenHeaderProps {
  title: string;
  /** Mobile : petite ligne verte au-dessus du grand titre */
  eyebrow?: string;
  subtitle?: ReactNode;
  back?: { href: string; label: string };
  /** Ordi : actions de la barre d'outils (petites capsules) */
  actions?: ReactNode;
  /** Mobile : 1 action maximum à côté du menu « … » */
  mobileActions?: ReactNode;
  /** Ordi : contrôle au centre de la barre d'outils */
  center?: ReactNode;
}

export function ScreenHeader({ title, eyebrow, subtitle, back, actions, mobileActions, center }: ScreenHeaderProps) {
  const more = useMoreMenuItems();
  return (
    <>
      {/* display: contents garde l'en-tête collant par rapport à la page entière */}
      <div className="contents md:hidden">
        <AppHeader
          className="-mx-4"
          app={PECUNIA_APP}
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          back={back}
          trailing={
            <>
              {mobileActions}
              <Menu iconOnly label="Plus" align="end" items={more} />
            </>
          }
        />
      </div>
      <AppHeader
        className="-mx-5 max-md:hidden"
        platform="mac"
        app={PECUNIA_APP}
        title={title}
        subtitle={subtitle}
        back={back}
        center={center}
        trailing={actions}
      />
    </>
  );
}
