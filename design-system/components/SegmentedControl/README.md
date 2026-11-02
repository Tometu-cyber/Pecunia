# SegmentedControl

Le contrôle segmenté d'iOS : 2 à 5 choix côte à côte dans une capsule grise, et une pastille blanche qui glisse sous le choix actif, avec un léger rebond.

**Quand l'utiliser :** pour changer de vue ou de période sans quitter l'écran (Jour / Semaine / Mois, Dépense / Revenu, Liste / Graphique). Pour plus de 5 choix, ou des choix rarement changés, utiliser un `Menu`.

**Props :**
- `items` : `[{ id, label, icon? }]`. Avec `icon`, le segment n'affiche que le pictogramme, et `label` est lu par les lecteurs d'écran.
- `value` / `defaultValue` / `onChange(id)`.
- `label` : nom du groupe pour les lecteurs d'écran (« Période »).
- `full` : pleine largeur, segments égaux (mobile).
- `size` : `regular` (36 px, mobile) ou `small` (28 px, ordi).

**Comportement :** les flèches gauche et droite changent de choix directement, comme des boutons radio. Début et Fin vont au premier et au dernier choix. Le rebond est coupé si « Réduire les animations » est activé.

**Règles :**
- Libellés d'un mot, de longueur proche.
- Ne pas mélanger texte et pictogrammes dans le même contrôle.
- Un seul contrôle segmenté par vue, en haut du contenu qu'il filtre.
