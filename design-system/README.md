# Portail

Un seul portail pour toutes mes apps perso : Finances, Sport, Alternance, Alimentation, Notes, et celles à venir. Ce design system suit les règles d'Apple : **Liquid Glass sur mobile** (iOS) et **le style macOS sur ordi**, en clair et en sombre.

Le principe en une phrase : **un socle commun pour tout le portail, et un style secondaire, sa propre couleur, pour chaque app.**

---

## 1. Les trois principes (repris d'Apple)

1. **Hiérarchie.** Le verre (Liquid Glass) sert à la couche de navigation : barre d'onglets, barres d'outils, barre latérale, boutons flottants. Il flotte au-dessus du contenu. **Jamais de verre sur le contenu lui-même** (cartes, listes, graphiques).
2. **Harmonie.** Les formes suivent la courbure de l'écran : arrondis concentriques (rayon intérieur = rayon extérieur − padding), capsules pour les boutons.
3. **Cohérence.** Mêmes composants, mêmes tailles et même comportement dans toutes les apps. Seule la couleur de l'app change.

> Règle d'or d'Apple : la couleur va dans le contenu, pas dans le verre. Les icônes et le texte posés sur le verre restent monochromes (`label`), sauf un bouton d'action principal.

---

## 2. Architecture : portail et apps

| Couche | Ce qu'elle porte | Tokens |
| --- | --- | --- |
| Portail (commun) | Fonds, textes, séparateurs, verre, typo, espacements, arrondis, bleu système | `bg-*`, `label-*`, `separator*`, `fill-*`, `glass-*`, `tint*` |
| App | Sa couleur d'identité, en 4 variantes | `<app>`, `<app>-text`, `<app>-bg`, `on-<app>` |

### Les apps

| App | Couleur | Inspiration Apple | Pleine | Texte | Fond teinté | Texte sur pleine |
| --- | --- | --- | --- | --- | --- | --- |
| Finances | Vert | Cartes / Wallet | `finances` | `finances-text` | `finances-bg` | `on-finances` (noir) |
| Sport | Rose | Forme | `sport` | `sport-text` | `sport-bg` | `on-sport` (noir) |
| Alternance | Indigo | Calendrier / Rappels | `alternance` | `alternance-text` | `alternance-bg` | `on-alternance` (blanc) |
| Alimentation | Orange | Santé | `alimentation` | `alimentation-text` | `alimentation-bg` | `on-alimentation` (noir) |
| Notes | Jaune | Notes | `notes` | `notes-text` | `notes-bg` | `on-notes` (noir) |

**Comment utiliser les quatre variantes :**
- `<app>` : la couleur pleine. Pour l'icône de l'app, les anneaux, les barres de graphiques, un bouton principal dans l'app. **Pas pour du texte** sur fond clair (le vert et le jaune sont illisibles sur blanc).
- `<app>-text` : quand un texte ou un chiffre doit être coloré (« +120 € », « J-4 »). Contraste 4,5:1 minimum vérifié sur `bg-primary` et `<app>-bg`, dans les deux thèmes.
- `<app>-bg` : fond d'une carte mise en avant ou de la tuile de l'app sur l'accueil du portail.
- `on-<app>` : texte posé sur la couleur pleine (bouton « Ajouter une dépense »).

**Ajouter une nouvelle app :** prendre une couleur système Apple pas encore utilisée (teal `#30b0c7`, cyan `#32ade6`, violet `#af52de`, marron `#a2845e`), créer ses quatre tokens et vérifier les contrastes. **Ne jamais réutiliser le rouge** (`danger`, réservé aux erreurs et suppressions) ni le bleu (`tint`, réservé au portail).

**La couleur ne suffit jamais seule :** chaque app a aussi son icône et son nom. Le rose et l'orange ont une luminosité proche, l'icône fait la différence.

**Dans une app**, on remplace la couleur d'accent : le bouton principal, la sélection et le curseur prennent `<app>` au lieu de `tint`. Tout le reste (fonds, textes, verre) ne change pas.

---

## 3. Mobile : Liquid Glass (iOS)

**Structure d'un écran :**
- **Grand titre** (`ios-large-title`) en haut à gauche, sur le contenu, avec une marge de `space-4` (16 px). Il se réduit en titre centré dans une barre en verre au défilement.
- **Contenu** sur `bg-grouped` : cartes en `bg-grouped-secondary`, `radius-lg`, padding `space-4`, écart `space-3`.
- **Barre d'onglets flottante en verre** en bas : capsule (`radius-full`), hauteur `tabbar-height`, décollée des bords de `space-4`, en `glass-regular` avec `shadow-glass`. Elle se rétracte au défilement vers le bas. Jusqu'à 5 onglets ; sur l'accueil du portail : Accueil, Apps, Recherche, Profil.
- **Boutons flottants** (ajouter, rechercher) : cercles ou capsules en verre de 44 px minimum.
- **Feuilles modales** : arrondi `radius-xl` en haut, voile `glass-dim` derrière.

**Règles Apple à respecter :**
- Zone tactile de **44 × 44 px minimum** (`hit-target`), même si l'icône est plus petite.
- Corps de texte à **17 px** (`ios-body`). Rien en dessous de 11 px.
- Les libellés de la barre d'onglets sont en `ios-caption-2`, l'onglet actif en `tint` (ou `<app>` dans une app).
- Pas de texte coloré sur le verre : `label` ou `label-secondary`.

## 4. Ordinateur : style macOS

**Structure d'une fenêtre :**
- **Barre latérale en verre** à gauche, largeur `sidebar-width`, en `glass-thick` flouté de `glass-blur-thick`. Elle flotte au-dessus du contenu, décollée de 8 px avec `radius-lg`. Elle liste les apps avec leur icône colorée (`<app>`), avec des en-têtes de groupe en `mac-subheadline`.
- **Barre d'outils** en haut du contenu : titre `mac-title-1` à gauche, boutons capsules en verre à droite (recherche, ajout).
- **Contenu** sur `bg-primary`, marge `space-5` (20 px), largeur max `content-max`, cartes en `bg-secondary` avec `radius-lg`.
- La ligne sélectionnée de la barre latérale : fond `fill-secondary`, `radius-sm`, icône à la couleur de l'app.

**Règles macOS :**
- Texte courant à **13 px** (`mac-body`). L'ordi est plus dense que le mobile.
- Contrôles de `control-mac` (28 px) de haut, `radius-xs` pour les champs et `radius-full` pour les boutons de barre d'outils.
- Survol visible sur tout ce qui est cliquable (fond `fill-tertiary`), car on a une souris.
- Raccourcis clavier pour les actions fréquentes (⌘N nouvelle entrée, ⌘F recherche, ⌘1 à ⌘5 pour changer d'app).

---

## 5. Couleurs

- **Fonds :** trois niveaux superposés, `bg-primary`, puis `bg-secondary`, puis `bg-tertiary`. Pour les écrans en listes (accueil, réglages) : `bg-grouped` et `bg-grouped-secondary`. Sur ordi, `bg-window` derrière la barre latérale.
- **Textes :** `label` pour tout ce qui compte, `label-secondary` pour les métadonnées, `label-tertiary` seulement pour les placeholders.
- **Bleu système `tint` :** couleur du portail lui-même. Pour un lien ou un petit texte bleu, utiliser `tint-text`.
- **États :** `success`, `warning`, `danger` sous forme d'icônes et de pastilles. Le texte d'erreur est en `danger-text`.

**Contraste (règle WCAG, 4,5:1 pour le texte) :** toutes les paires `<app>-text` et `on-<app>` passent dans les deux thèmes.
⚠️ Exceptions héritées d'Apple : `label-secondary` atteint environ 3,4:1 sur blanc. Il est réservé aux textes de 15 px et plus qui ne portent pas d'information indispensable. Le texte blanc sur `tint` (environ 4:1) ne s'utilise qu'à 17 px demi-gras ou plus, sur les boutons.

## 6. Le verre (Liquid Glass) en web

Recette CSS de référence :

```css
.glass {
  background: var(--glass-regular);
  backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  border: 0.5px solid var(--glass-stroke);
  box-shadow: inset 0 1px 0 var(--glass-highlight), var(--shadow-glass);
  border-radius: var(--radius-full);
}
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: var(--bg-tertiary); }
}
```

- `glass-regular` : barres et boutons. `glass-thick` : barre latérale et menus. `glass-clear` : seulement sur une photo ou un média.
- Le verre ne se superpose **jamais** à du verre.
- Respecter « Réduire la transparence » : `@media (prefers-reduced-transparency: reduce)` remplace le verre par `bg-tertiary`.

## 7. Typographie

- **SF Pro**, la police d'Apple, via la police système (`-apple-system`). Elle s'affiche nativement sur iPhone et Mac. Ailleurs, la police système de l'appareil prend le relais. La licence d'Apple interdit d'embarquer SF Pro sur le web : pas de fichier de police.
- **SF Pro Rounded** (`rounded`) pour les **gros chiffres** (`stat-*`), comme dans Forme et Santé.
- **SF Mono** (`mono`) pour les identifiants et le code.
- Deux échelles : `ios-*` sur mobile (base 17 px), `mac-*` sur ordi (base 13 px). On passe de l'une à l'autre au point de rupture de 768 px.
- Majuscule seulement au premier mot des titres et des boutons (« Ajouter une dépense »).

## 8. Espacements et arrondis

- Grille de 4 px : `space-1` (4) à `space-10` (40).
- Marges d'écran : `space-4` (16 px) sur iPhone, `space-5` (20 px) sur Mac.
- **Concentricité :** une carte en `radius-lg` (26 px) avec un padding de 10 px contient des éléments en `radius-md` (16 px).
- Boutons : capsules (`radius-full`) partout en Liquid Glass, sauf les champs macOS (`radius-xs`).

## 9. Iconographie

- Dans une app native : **SF Symbols**, contour, même graisse que le texte voisin.
- Sur le web, la licence de SF Symbols interdit leur usage hors des plateformes Apple. Il faut un set au contour fin qui leur ressemble (Lucide ou Phosphor, trait de 1,5 px).
- **Icônes d'app** (composant `AppIcon`) : dessinées comme les icônes d'iOS 26. Squircle, fond en dégradé de `<app>`, pictogramme en couches de verre avec ombre et reflet. Elles existent en apparence claire, sombre (fond graphite, pictogramme coloré) et transparente (verre sur fond d'écran). L'icône du Portail assemble quatre tuiles aux couleurs des apps.
- Pas d'emoji dans l'interface.

## 10. Ton

- Tutoiement, phrases courtes, verbe d'abord sur les boutons : « Ajouter une séance », « Voir le mois ».
- Les messages de confirmation sont brefs (« Enregistré »), sans point d'exclamation.
- Les écrans vides proposent une action : « Ajoute ta première dépense ».

---

## Composants

Les composants sont en React 18 (`window.Portail`) et ne lisent que les tokens.

| Composant | Rôle | Où |
| --- | --- | --- |
| `AppIcon` | Icône d'app façon iOS 26, en apparence claire, sombre ou transparente | Partout |
| `AppTile` | Tuile d'app de l'accueil, avec chiffre clé et jauge | Accueil du portail |
| `GlassButton` | Bouton capsule en verre ou plein | Actions flottantes, barres d'outils |
| `TabBar` | Barre d'onglets flottante en verre | Mobile (moins de 768 px) |
| `Sidebar` | Barre latérale en verre épais | Ordi (768 px et plus) |
| `AppHeader` | En-tête d'app : grand titre qui se réduit (mobile), barre d'outils (ordi) | Haut de chaque écran d'app |
| `Sheet` | Feuille modale d'ajout rapide, avec `pt-form-group` pour les champs | Ajouts, éditions courtes |
| `Icon` | Pictogrammes au trait | Partout |
| `Card` | Bloc de contenu avec titre et action | Partout |
| `List` / `ListRow` | Liste groupée façon Réglages, lignes avec valeur | Partout |
| `Button` | Bouton dans le contenu : plein, teinté, gris, simple | Cartes, formulaires |
| `TextField` | Champ de saisie, recherche, erreur | Formulaires, barres d'outils |
| `Menu` | Menu déroulant en verre : choisir une valeur ou lancer une action | Filtres, tris, actions « … » |
| `SegmentedControl` | 2 à 5 choix côte à côte, pastille qui glisse | Périodes, types, vues |
| `Toggle` | Interrupteur façon iOS 26 | Réglages, options |
| `DatePicker` | Sélecteur de date compact ou calendrier affiché | Formulaires, Agenda |
| `ProgressRing` | Anneaux de progression façon Forme | Accueil, Sport, Alimentation |
| `BarChart` | Graphique en barres, une série | Finances, Sport, Alimentation |
| `LineChart` | Graphique en courbe avec suivi au survol | Solde, poids, tendances |

Le style d'une app s'applique avec la classe `pt-app-<app>` sur un conteneur : elle redéfinit `--app`, `--app-text`, `--app-bg` et `--on-app` pour tout ce qu'il contient.

**Écrans de référence :**
- `HomeMobile` et `HomeDesktop` : l'accueil du portail, sur iPhone et sur Mac.
- `FinancesMobile` et `FinancesDesktop` : l'accueil de Pecunia, l'app Finances, refait avec le design system à partir de l'existant (même contenu : solde du mois, comptes, budget global, à venir, répartition, dépenses mensuelles). C'est le **modèle de l'accueil d'une app** : en-tête de l'app, filtres (mois, compte), un chiffre clé en grand, puis des cartes et des listes. Sur ordi, la barre latérale du portail laisse la place aux sections de l'app, avec un retour « Portail » en haut.

## Ce qui reste à faire

1. Les autres écrans de Pecunia (Transactions, Budgets, Prévisionnel) et l'intégration dans le code Next.js
2. Selon les besoins des apps : onglets internes, barre de recherche avec résultats, états vides et chargement, notifications (toast)
