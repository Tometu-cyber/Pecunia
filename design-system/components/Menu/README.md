# Menu

Le menu déroulant façon Apple : un bouton qui ouvre une liste en verre épais. Il a deux usages : **choisir une valeur** (une coche marque l'option choisie, comme les menus de macOS) ou **lancer une action** (Modifier, Dupliquer, Supprimer).

**Choisir une valeur :** passer `value` ou `defaultValue` (`null` si rien n'est choisi), avec `onChange(id)`. Le bouton affiche l'option choisie, ou `placeholder` tant que rien n'est choisi.

**Lancer une action :** ne pas passer de valeur. Le bouton affiche `label`, et chaque option déclenche son `onSelect`. Avec `iconOnly`, le bouton devient un rond en verre « … » (pictogramme `more`).

**Props :**
- `items` : `[{ id, label, icon?, app?, hint?, shortcut?, destructive?, disabled?, onSelect?, href? }]`. Avec `href`, l'option est un lien (`role="menuitem"` conservé), et le menu se ferme sans rendre le focus au bouton puisque la page change. Ajouter `{ divider: true }` pour un séparateur et `{ section: 'Titre' }` pour un titre de groupe.
- `label` : texte du bouton (actions) ou nom lu par les lecteurs d'écran.
- `variant` : `gray` (par défaut) ou `tinted` et les autres variantes de `Button`. `app` : couleur du bouton.
- `size` : `regular` (mobile, lignes de 44 px) ou `small` (ordi : menu dense de 13 px, survol bleu comme sur macOS, raccourcis clavier à droite).
- `align` : `end` pour ouvrir le menu aligné à droite du bouton (bouton en haut à droite d'un écran).
- `icon`, `placeholder`, `onSelect(id)`, `defaultOpen`, `linkAs` (composant de lien).

**Comportement :**
- Clic ou flèche bas sur le bouton : le menu s'ouvre et le focus va sur l'option choisie, sinon la première.
- Flèches haut et bas pour se déplacer, Début et Fin, Entrée pour valider.
- Échap ou un clic à côté : le menu se ferme et le focus revient au bouton.
- Animation d'ouverture depuis le bouton, coupée si « Réduire les animations » est activé.

**Règles :**
- 2 à 10 options. Au-delà, utiliser une feuille avec recherche.
- L'action destructive (Supprimer) va en dernier, après un séparateur, en rouge.
- Libellés courts, sans point. Pictogramme à droite du texte, comme sur iOS.
- Pour 2 ou 3 choix toujours visibles (Jour / Semaine / Mois), préférer un `SegmentedControl`.
- Pour choisir une valeur dans un formulaire, préférer `Select`, qui a l'apparence d'un champ.
- Sur ordi, le texte blanc sur le survol bleu fait 4:1, comme dans macOS. Il reste lisible car il n'apparaît que sous la souris.
