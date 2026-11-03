"use client";

/**
 * AppIcon : icône d'app façon iOS 26 (squircle, fond en dégradé, pictogramme en couches).
 * Apparence automatique selon le thème, ou forcée (light, dark, clear).
 * Voir design-system/components/AppIcon/README.md.
 */
import { clsx } from "clsx";
import { useId, type ReactNode } from "react";
import { appClass, type AppId } from "./ds";

const SQUIRCLE = "M0 50C0 9 9 0 50 0S100 9 100 50 91 100 50 100 0 91 0 50Z";

function glyph(app: AppId, F: string, G: string): ReactNode {
  const back = "pt-ic-back";
  const det = "pt-ic-detail";
  switch (app) {
    case "finances":
      return (
        <>
          <rect className={back} x={24} y={24} width={50} height={32} rx={7} transform="rotate(-12 49 40)" />
          <rect fill={F} x={20} y={36} width={60} height={40} rx={10} />
          <rect className={det} x={56} y={48} width={24} height={16} rx={8} />
          <circle fill={F} cx={64} cy={56} r={3.6} />
        </>
      );
    case "sport":
      return (
        <>
          <rect className={back} x={13} y={39} width={10} height={22} rx={5} />
          <rect className={back} x={77} y={39} width={10} height={22} rx={5} />
          <rect fill={F} x={28} y={46} width={44} height={8} rx={4} />
          <rect fill={F} x={22} y={28} width={13} height={44} rx={6.5} />
          <rect fill={F} x={65} y={28} width={13} height={44} rx={6.5} />
          <rect className={det} x={26} y={33} width={5} height={34} rx={2.5} opacity={0.35} />
          <rect className={det} x={69} y={33} width={5} height={34} rx={2.5} opacity={0.35} />
        </>
      );
    case "alternance":
      return (
        <>
          <rect className="pt-ic-back-stroke" x={37} y={22} width={26} height={20} rx={7} fill="none" strokeWidth={6} />
          <rect fill={F} x={18} y={36} width={64} height={42} rx={11} />
          <rect className={det} x={18} y={54} width={64} height={3} opacity={0.3} />
          <rect className={det} x={43} y={49} width={14} height={13} rx={4} />
        </>
      );
    case "alimentation":
      return (
        <>
          <path className="pt-ic-back-stroke" fill="none" strokeWidth={5} strokeLinecap="round" d="M38 38c-5-5 4-9 0-16M50 38c-5-5 4-9 0-16M62 38c-5-5 4-9 0-16" />
          <rect className={back} x={39} y={72} width={22} height={8} rx={4} />
          <path fill={F} d="M20 50H80A30 27 0 0 1 20 50Z" />
          <rect fill={F} x={14} y={45} width={72} height={9} rx={4.5} />
          <rect className={det} x={30} y={60} width={40} height={3.5} rx={1.75} opacity={0.35} />
        </>
      );
    case "notes":
      return (
        <>
          <rect className={back} x={32} y={19} width={44} height={60} rx={9} transform="rotate(9 54 49)" />
          <rect fill={F} x={22} y={20} width={48} height={62} rx={9} />
          <path className={det} d="M31 20h30a9 9 0 0 1 9 9v5H22v-5a9 9 0 0 1 9-9z" />
          <rect className={det} x={30} y={45} width={32} height={4} rx={2} opacity={0.4} />
          <rect className={det} x={30} y={56} width={32} height={4} rx={2} opacity={0.4} />
          <rect className={det} x={30} y={67} width={20} height={4} rx={2} opacity={0.4} />
        </>
      );
    default:
      return (
        <>
          <rect className="pt-ic-t1" x={20} y={20} width={28} height={28} rx={9} />
          <rect className="pt-ic-t2" x={52} y={20} width={28} height={28} rx={14} />
          <rect className="pt-ic-t3" x={20} y={52} width={28} height={28} rx={14} />
          <rect className="pt-ic-t4" x={52} y={52} width={28} height={28} rx={9} />
          <rect fill={G} x={20} y={20} width={28} height={28} rx={9} />
          <rect fill={G} x={52} y={20} width={28} height={28} rx={14} />
          <rect fill={G} x={20} y={52} width={28} height={28} rx={14} />
          <rect fill={G} x={52} y={52} width={28} height={28} rx={9} />
        </>
      );
  }
}

function Stop({ offset, color, opacity = 1 }: { offset: number; color: string; opacity?: number }) {
  return <stop offset={offset} style={{ stopColor: color, stopOpacity: opacity }} />;
}

export function AppIcon({
  app = "portail",
  size = 40,
  appearance = "auto",
  label,
  className,
}: {
  app?: AppId;
  size?: number;
  /** auto suit le thème ; clear = verre transparent sur un fond d'écran */
  appearance?: "auto" | "light" | "dark" | "clear";
  label?: string;
  className?: string;
}) {
  const uid = `pt${useId().replace(/[^A-Za-z0-9]/g, "")}`;
  const u = (n: string) => `url(#${uid}${n})`;
  return (
    <span
      className={clsx("pt-appicon", appClass(app), appearance !== "auto" && `pt-appicon-${appearance}`, className)}
      style={{ width: size, height: size }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className="pt-appicon-svg">
        <defs>
          <linearGradient id={`${uid}bg`} x1={0} y1={0} x2={0.6} y2={1}>
            <Stop offset={0} color="var(--ic-bg1)" />
            <Stop offset={1} color="var(--ic-bg2)" />
          </linearGradient>
          <radialGradient id={`${uid}sh`} cx={0.3} cy={0.05} r={0.85}>
            <Stop offset={0} color="#ffffff" opacity={0.55} />
            <Stop offset={0.55} color="#ffffff" opacity={0} />
          </radialGradient>
          <linearGradient id={`${uid}fg`} x1={0} y1={0} x2={0.3} y2={1}>
            <Stop offset={0} color="var(--ic-fg1)" />
            <Stop offset={1} color="var(--ic-fg2)" />
          </linearGradient>
          <linearGradient id={`${uid}gl`} x1={0} y1={0} x2={0} y2={1}>
            <Stop offset={0} color="#ffffff" opacity={0.6} />
            <Stop offset={0.5} color="#ffffff" opacity={0.08} />
            <Stop offset={1} color="#ffffff" opacity={0} />
          </linearGradient>
          <linearGradient id={`${uid}rim`} x1={0} y1={0} x2={0} y2={1}>
            <Stop offset={0} color="#ffffff" opacity={0.75} />
            <Stop offset={0.3} color="#ffffff" opacity={0} />
            <Stop offset={0.75} color="#000000" opacity={0} />
            <Stop offset={1} color="#000000" opacity={0.18} />
          </linearGradient>
          <filter id={`${uid}ds`} x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx={0} dy={2.5} stdDeviation={2.6} floodColor="#000000" floodOpacity={0.24} />
          </filter>
        </defs>
        <path className="pt-ic-bg" d={SQUIRCLE} fill={u("bg")} />
        <path className="pt-ic-sheen" d={SQUIRCLE} fill={u("sh")} />
        <g filter={u("ds")}>{glyph(app, u("fg"), u("gl"))}</g>
        <path className="pt-ic-rim" d={SQUIRCLE} fill="none" stroke={u("rim")} strokeWidth={2} />
      </svg>
    </span>
  );
}
