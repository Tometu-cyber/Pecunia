"use client";

/**
 * AppHeader : en-tête d'une app.
 * - Mobile (`platform: "ios"`) : grand titre dans le contenu, barre fixée en haut avec les
 *   actions en verre ; au défilement, le titre réapparaît en petit au centre, sur un flou doux.
 * - Ordi (`platform: "mac"`) : barre d'outils (titre à gauche, contrôle au centre, petites
 *   capsules à droite), flou dès qu'on fait défiler.
 * Le placer en premier dans la zone qui défile. Voir design-system/components/AppHeader/README.md.
 */
import { clsx } from "clsx";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { appClass, type AppId } from "./ds";
import { GlassButton, type GlassButtonProps } from "./glass-button";
import { Menu, type MenuProps } from "./menu";

export type AppHeaderAction = GlassButtonProps | { menu: MenuProps };

export interface AppHeaderProps {
  title: string;
  subtitle?: ReactNode;
  /** Mobile : petite ligne colorée au-dessus du titre */
  eyebrow?: string;
  app?: AppId;
  platform?: "ios" | "mac";
  back?: { label?: string; href?: string; onClick?: () => void };
  /** 2 actions maximum sur mobile ; une seule `prominent` */
  actions?: AppHeaderAction[];
  /** Ordi : élément au centre de la barre d'outils */
  center?: ReactNode;
  className?: string;
}

function scrollParent(el: HTMLElement | null): HTMLElement | Window {
  let p = el?.parentElement ?? null;
  while (p && p !== document.body) {
    const o = getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
    p = p.parentElement;
  }
  return window;
}

export function AppHeader({ title, subtitle, eyebrow, app, platform = "ios", back, actions = [], center, className }: AppHeaderProps) {
  const mac = platform === "mac";
  const [collapsed, setCollapsed] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const bigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sp = scrollParent(rootRef.current);
    const check = () => {
      const top = sp === window ? window.scrollY : (sp as HTMLElement).scrollTop;
      if (mac) {
        setCollapsed(top > 4);
        return;
      }
      const big = bigRef.current;
      const limit = big ? big.offsetTop + big.offsetHeight - 52 : 40;
      setCollapsed(top > limit);
    };
    check();
    sp.addEventListener("scroll", check, { passive: true });
    return () => sp.removeEventListener("scroll", check);
  }, [mac]);

  const renderedActions = actions.map((a, i) =>
    "menu" in a ? (
      <Menu key={i} size={mac ? "small" : "regular"} {...a.menu} />
    ) : (
      <GlassButton key={i} size={mac ? "small" : "regular"} {...a} app={a.prominent ? (a.app ?? app) : a.app} />
    ),
  );
  const backButton = back ? (
    <GlassButton icon={ChevronLeft} label={back.label ?? "Retour"} size={mac ? "small" : "regular"} href={back.href} onClick={back.onClick} />
  ) : null;

  if (mac) {
    return (
      <header ref={rootRef} className={clsx("pt-root pt-hdr pt-hdr-mac", collapsed && "is-collapsed", appClass(app), className)}>
        <div className="pt-hdr-bar">
          {backButton}
          <div className="pt-hdr-mac-titles">
            <h1 className="pt-hdr-mac-title">{title}</h1>
            {subtitle && <p className="pt-hdr-mac-sub">{subtitle}</p>}
          </div>
          {center}
          <div className="pt-hdr-actions">{renderedActions}</div>
        </div>
      </header>
    );
  }
  return (
    <>
      <header ref={rootRef} className={clsx("pt-root pt-hdr pt-hdr-ios", collapsed && "is-collapsed", appClass(app), className)}>
        <div className="pt-hdr-bar">
          <div className="pt-hdr-side">{backButton}</div>
          <div className="pt-hdr-small" aria-hidden={collapsed ? undefined : true}>
            {title}
          </div>
          <div className="pt-hdr-side pt-hdr-actions">{renderedActions}</div>
        </div>
      </header>
      <div ref={bigRef} className={clsx("pt-root pt-hdr-big", appClass(app))}>
        {eyebrow && <div className="pt-hdr-eyebrow">{eyebrow}</div>}
        <h1 className="pt-hdr-title">{title}</h1>
        {subtitle && <p className="pt-hdr-sub">{subtitle}</p>}
      </div>
    </>
  );
}
