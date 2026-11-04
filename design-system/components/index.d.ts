import type * as React from 'react';

export type AppId = 'finances' | 'sport' | 'alternance' | 'alimentation' | 'notes' | 'portail';
export type IconName = 'home' | 'grid' | 'search' | 'user' | 'plus' | 'settings' | 'chevron' | 'calendar' | 'bell' | 'alert' | 'check' | 'chart' | 'euro' | 'clock' | 'updown' | 'more' | 'edit' | 'copy' | 'trash' | 'sort' | 'x' | 'back' | 'filter' | 'card' | 'coins' | 'swap' | 'pin' | 'trend' | AppId;

/** Composant de lien de l'app (Next.js Link, React Router Link…) : reçoit href, className, onClick, children. */
export type LinkComponent = React.ComponentType<{ href: string; className?: string; onClick?: () => void; children?: React.ReactNode; [key: string]: unknown }>;
/** Choisit le composant utilisé par tous les `href` (par défaut une balise <a>). */
export declare function setLinkComponent(link: LinkComponent | null): void;
/** Props communes aux composants qui peuvent être des liens. */
export interface Linkable { href?: string; linkAs?: LinkComponent }

export interface IconProps { name: IconName; size?: number; strokeWidth?: number; label?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;

export interface AppIconProps {
  app?: AppId; size?: number; label?: string; className?: string;
  /** auto suit le thème ; clear = verre transparent sur un fond d'écran */
  appearance?: 'auto' | 'light' | 'dark' | 'clear';
}
export declare function AppIcon(props: AppIconProps): React.ReactElement;

export interface AppTileProps {
  app?: AppId; icon?: IconName; name: string; value?: React.ReactNode; detail?: React.ReactNode;
  /** 0 à 1 : affiche une jauge à la couleur de l'app */
  progress?: number; variant?: 'plain' | 'tinted'; onClick?: () => void; className?: string;
}
export declare function AppTile(props: AppTileProps): React.ReactElement;

export interface GlassButtonProps extends Linkable {
  icon?: IconName; label?: string; children?: React.ReactNode; prominent?: boolean; app?: AppId;
  size?: 'regular' | 'small'; type?: 'button' | 'submit'; disabled?: boolean; onClick?: () => void; className?: string;
}
export declare function GlassButton(props: GlassButtonProps): React.ReactElement;

export interface TabItem { id: string; label: string; icon: IconName; href?: string }
export interface TabBarProps {
  items: TabItem[]; active?: string; defaultActive?: string; onChange?: (id: string) => void;
  action?: { icon: IconName; label: string; href?: string; onClick?: () => void; prominent?: boolean }; app?: AppId; label?: string; className?: string;
  /** Pastille glissable façon iOS 26 (désactivée par défaut) */
  draggable?: boolean;
  linkAs?: LinkComponent;
}
export declare function TabBar(props: TabBarProps): React.ReactElement;

export interface SidebarItem { id: string; label: string; app?: AppId; icon?: IconName; badge?: React.ReactNode; href?: string }
export interface SidebarProps {
  sections: { title?: string; items: SidebarItem[] }[]; active?: string; defaultActive?: string;
  onSelect?: (id: string) => void; windowControls?: boolean; label?: string; footer?: React.ReactNode; className?: string;
  /** Couleur de l'app : pictogrammes des lignes en <app>-text */
  app?: AppId;
  linkAs?: LinkComponent;
}
export declare function Sidebar(props: SidebarProps): React.ReactElement;

export interface CardProps { title?: string; subtitle?: string; action?: { label: string; onClick?: () => void }; app?: AppId; children?: React.ReactNode; className?: string; style?: React.CSSProperties }
export declare function Card(props: CardProps): React.ReactElement;

export interface ListProps { header?: string; footer?: string; inset?: boolean; plain?: boolean; children?: React.ReactNode; className?: string }
export declare function List(props: ListProps): React.ReactElement;

export interface ListRowProps extends Linkable {
  title: React.ReactNode; subtitle?: React.ReactNode; app?: AppId; icon?: IconName; appIcon?: boolean;
  value?: React.ReactNode; tone?: 'default' | 'positive' | 'negative' | 'app' | 'strong'; chevron?: boolean; onClick?: () => void; className?: string;
}
export declare function ListRow(props: ListRowProps): React.ReactElement;

export interface ButtonProps extends Linkable {
  variant?: 'filled' | 'tinted' | 'gray' | 'plain'; size?: 'large' | 'regular' | 'small'; app?: AppId; icon?: IconName;
  full?: boolean; disabled?: boolean; type?: 'button' | 'submit'; onClick?: () => void; children?: React.ReactNode; className?: string;
  /** Nom lu par les lecteurs d'écran quand le bouton n'a qu'un pictogramme */
  label?: string;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface TextFieldProps {
  label?: string; placeholder?: string; value?: string; defaultValue?: string; onChange?: (value: string) => void;
  hint?: string; error?: string; suffix?: string; icon?: IconName; variant?: 'default' | 'search'; size?: 'regular' | 'small';
  app?: AppId; type?: string; inputMode?: string; id?: string; className?: string;
}
export declare function TextField(props: TextFieldProps): React.ReactElement;

export interface Ring { app: AppId; value: number; label: string; display?: React.ReactNode }
export interface ProgressRingProps { rings: Ring[]; size?: number; thickness?: number; center?: { value: React.ReactNode; label?: string }; legend?: boolean; className?: string }
export declare function ProgressRing(props: ProgressRingProps): React.ReactElement;

export interface BarChartProps {
  data: { label: string; value: number }[]; app?: AppId; highlight?: number; goal?: number; goalLabel?: string;
  max?: number; height?: number; title?: string; format?: (v: number) => string; className?: string;
}
export declare function BarChart(props: BarChartProps): React.ReactElement;

export type MenuItem =
  | { id: string; label: string; icon?: IconName; app?: AppId; hint?: string; shortcut?: string; destructive?: boolean; disabled?: boolean; onSelect?: () => void; href?: string }
  | { divider: true }
  | { section: string };
export interface MenuProps {
  items: MenuItem[];
  /** Avec value ou defaultValue : menu de choix (coche). Sans : menu d'actions. */
  value?: string | null; defaultValue?: string | null; onChange?: (id: string) => void; onSelect?: (id: string) => void;
  label?: string; placeholder?: string; icon?: IconName; iconOnly?: boolean;
  variant?: 'filled' | 'tinted' | 'gray' | 'plain'; size?: 'regular' | 'small'; app?: AppId; align?: 'start' | 'end';
  defaultOpen?: boolean; className?: string; linkAs?: LinkComponent;
}
export declare function Menu(props: MenuProps): React.ReactElement;

export interface SegmentedControlProps {
  items: { id: string; label: string; icon?: IconName }[]; value?: string; defaultValue?: string; onChange?: (id: string) => void;
  label?: string; full?: boolean;
  /** auto : regular (36 px) sur mobile, small (28 px) sur ordi */
  size?: 'regular' | 'small' | 'auto'; app?: AppId; className?: string;
}
export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;

export interface ToggleProps {
  label?: string; hint?: string; ariaLabel?: string; checked?: boolean; defaultChecked?: boolean; onChange?: (on: boolean) => void;
  app?: AppId; size?: 'regular' | 'small'; disabled?: boolean; className?: string;
}
export declare function Toggle(props: ToggleProps): React.ReactElement;

export interface DatePickerProps {
  value?: Date | null; defaultValue?: Date | null; onChange?: (date: Date) => void; label?: string; placeholder?: string;
  min?: Date; max?: Date; app?: AppId; size?: 'regular' | 'small'; format?: Intl.DateTimeFormatOptions;
  inline?: boolean; align?: 'start' | 'end'; today?: Date; defaultOpen?: boolean; className?: string;
}
export declare function DatePicker(props: DatePickerProps): React.ReactElement;
export declare function Calendar(props: { value?: Date | null; onChange?: (date: Date) => void; min?: Date; max?: Date; app?: AppId; today?: Date; autoFocus?: boolean }): React.ReactElement;

export interface AppHeaderProps {
  title: string; subtitle?: string; eyebrow?: string; app?: AppId; platform?: 'ios' | 'mac';
  back?: { label?: string; onClick?: () => void; href?: string };
  actions?: (GlassButtonProps | { menu: MenuProps })[]; center?: React.ReactNode; className?: string;
  /** Éléments libres placés avant les actions (filtre, avatar…) */
  trailing?: React.ReactNode;
  linkAs?: LinkComponent;
}
export declare function AppHeader(props: AppHeaderProps): React.ReactElement;

export interface SheetProps {
  open: boolean; onClose?: () => void; title: string; app?: AppId; platform?: 'ios' | 'mac';
  primaryAction?: { label: string; onClick?: () => void }; cancelLabel?: string; detent?: 'medium' | 'large';
  dismissible?: boolean; contained?: boolean; noAutoFocus?: boolean; children?: React.ReactNode; className?: string;
}
export declare function Sheet(props: SheetProps): React.ReactElement | null;

export interface LineChartProps {
  data: { label: string; value: number }[]; app?: AppId; height?: number; title?: string; format?: (v: number) => string;
  area?: boolean; goal?: number; goalLabel?: string; min?: number; max?: number; ticks?: number[]; labelEvery?: number; highlight?: number; className?: string;
}
export declare function LineChart(props: LineChartProps): React.ReactElement;

export interface SelectOption { value: string | number; label: React.ReactNode; disabled?: boolean }
export interface SelectProps {
  options: SelectOption[];
  value?: string | number | null; defaultValue?: string | number; onChange?: (value: string) => void;
  /** Champ caché envoyé avec le formulaire */
  name?: string;
  placeholder?: string; disabled?: boolean; required?: boolean; id?: string; app?: AppId;
  /** cell : compacte et sans fond, pour un tableau */
  variant?: 'field' | 'cell';
  /** Par défaut : regular sur mobile, small à partir de 768 px */
  size?: 'regular' | 'small';
  'aria-label'?: string; 'aria-invalid'?: boolean; defaultOpen?: boolean; className?: string;
}
export declare function Select(props: SelectProps): React.ReactElement;

declare global {
  interface Window { Portail: { Icon: typeof Icon; AppIcon: typeof AppIcon; AppTile: typeof AppTile; GlassButton: typeof GlassButton; TabBar: typeof TabBar; Sidebar: typeof Sidebar; Card: typeof Card; List: typeof List; ListRow: typeof ListRow; Button: typeof Button; TextField: typeof TextField; ProgressRing: typeof ProgressRing; BarChart: typeof BarChart; Menu: typeof Menu; SegmentedControl: typeof SegmentedControl; Toggle: typeof Toggle; DatePicker: typeof DatePicker; Calendar: typeof Calendar; AppHeader: typeof AppHeader; Sheet: typeof Sheet; LineChart: typeof LineChart; Select: typeof Select; setLinkComponent: typeof setLinkComponent } }
}
