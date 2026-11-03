"use client";

/**
 * TabBar : barre d'onglets flottante en verre (mobile, moins de 768 px), 3 à 5 onglets,
 * avec un bouton rond facultatif à droite (« + » plein à la couleur de l'app).
 * Le contenu prévoit un padding bas de tabbar-height + space-8.
 * Voir design-system/components/TabBar/README.md.
 *
 * Comme la barre d'onglets d'iOS 26 : une pastille glisse sous l'onglet actif. On peut aussi
 * poser le doigt sur la barre et glisser : la pastille suit le doigt, grossit un peu, et
 * l'onglet sous le doigt s'ouvre au lâcher. Un simple toucher reste un toucher.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { appClass, Glyph, type AppId } from "./ds";
import { GlassButton } from "./glass-button";

export interface TabItem {
  id: string;
  /** Un seul mot */
  label: string;
  icon: LucideIcon;
  href?: string;
}

export interface TabBarProps {
  items: TabItem[];
  active?: string;
  defaultActive?: string;
  onChange?: (id: string) => void;
  action?: { icon: LucideIcon; label: string; href?: string; onClick?: () => void; prominent?: boolean };
  app?: AppId;
  label?: string;
  className?: string;
}

/** Déplacement (px) au-delà duquel un toucher devient un glissé. */
const DRAG_THRESHOLD = 8;

interface Rect {
  left: number;
  width: number;
}

export function TabBar({ items, active, defaultActive, onChange, action, app, label = "Navigation principale", className }: TabBarProps) {
  const router = useRouter();
  const [inner, setInner] = useState(defaultActive ?? items[0]?.id);
  // Onglet choisi au doigt, affiché tout de suite pendant que la navigation se fait
  const [pending, setPending] = useState<string | null>(null);
  const current = pending ?? active ?? inner;
  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLElement | null)[]>([]);
  const [rects, setRects] = useState<Rect[]>([]);
  const [drag, setDrag] = useState<{ x: number; over: number } | null>(null);
  const gesture = useRef<{ id: number; startX: number; dragging: boolean; over: number } | null>(null);

  // La navigation est arrivée : l'onglet actif vient de nouveau de la page
  useEffect(() => setPending(null), [active]);

  const measure = useCallback(() => {
    setRects(tabRefs.current.map((el) => (el ? { left: el.offsetLeft, width: el.offsetWidth } : { left: 0, width: 0 })));
  }, []);
  useLayoutEffect(() => {
    measure();
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [measure, items.length]);

  const select = (id: string) => {
    if (active === undefined) setInner(id);
    onChange?.(id);
  };

  /** Onglet sous une abscisse (relative à la barre) */
  const indexAt = (x: number) => {
    let best = 0;
    rects.forEach((r, i) => {
      if (x >= r.left) best = i;
    });
    return best;
  };

  const localX = (e: PointerEvent) => e.clientX - (navRef.current?.getBoundingClientRect().left ?? 0);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    gesture.current = { id: e.pointerId, startX: e.clientX, dragging: false, over: indexAt(localX(e)) };
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    if (!g.dragging) {
      if (Math.abs(e.clientX - g.startX) < DRAG_THRESHOLD) return;
      // le geste devient un glissé : la barre garde le doigt, même en dehors
      g.dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const x = localX(e);
    const over = indexAt(x);
    if (over !== g.over) {
      g.over = over;
      // petit retour haptique en passant d'un onglet à l'autre (Android ; ignoré ailleurs)
      navigator.vibrate?.(8);
    }
    setDrag({ x, over });
  };

  const endGesture = (e: PointerEvent<HTMLElement>, cancelled: boolean) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || g.id !== e.pointerId || !g.dragging) return;
    setDrag(null);
    if (cancelled) return;
    const it = items[g.over];
    if (!it || it.id === current) return;
    setPending(it.id);
    select(it.id);
    if (it.href) router.push(it.href);
  };

  // Pastille : sous l'onglet actif, ou centrée sous le doigt pendant un glissé
  const activeIndex = items.findIndex((it) => it.id === current);
  const base = rects[activeIndex] ?? rects[0];
  let pill: CSSProperties | undefined;
  if (base && rects.length === items.length) {
    if (drag) {
      const first = rects[0]!;
      const last = rects[rects.length - 1]!;
      const w = rects[drag.over]?.width ?? base.width;
      const left = Math.min(Math.max(drag.x - w / 2, first.left), last.left + last.width - w);
      pill = { translate: `${left}px 0`, width: w };
    } else if (activeIndex >= 0) {
      pill = { translate: `${base.left}px 0`, width: base.width };
    }
  }

  return (
    <div className={clsx("pt-root pt-tabbar-row", appClass(app), className)}>
      <nav
        ref={navRef}
        className={clsx("pt-tabbar pt-glass has-pill", drag && "is-dragging")}
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endGesture(e, false)}
        onPointerCancel={(e) => endGesture(e, true)}
      >
        {pill && <span className="pt-tab-pill" style={pill} aria-hidden />}
        {items.map((it, i) => {
          const props = {
            ref: (el: HTMLElement | null) => {
              tabRefs.current[i] = el;
            },
            className: clsx("pt-tab", drag?.over === i && "is-over"),
            "aria-current": it.id === current ? ("page" as const) : undefined,
            onClick: () => select(it.id),
          };
          const content = (
            <>
              <Glyph icon={it.icon} size={24} />
              <span>{it.label}</span>
            </>
          );
          return it.href ? (
            <Link key={it.id} href={it.href} {...props} ref={props.ref as (el: HTMLAnchorElement | null) => void} draggable={false}>
              {content}
            </Link>
          ) : (
            <button key={it.id} type="button" {...props} ref={props.ref as (el: HTMLButtonElement | null) => void}>
              {content}
            </button>
          );
        })}
      </nav>
      {action && (
        <GlassButton icon={action.icon} label={action.label} href={action.href} onClick={action.onClick} app={app} prominent={action.prominent} />
      )}
    </div>
  );
}
