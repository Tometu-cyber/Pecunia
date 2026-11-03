# BarChart

Un graphique en barres pour une seule série (dépenses par jour, séances par semaine, calories par repas), à la couleur de l'app.

**Props :**
- `data` : `[{ label, value }]`, 12 barres maximum.
- `app` : couleur des barres.
- `highlight` : index de la barre mise en avant (aujourd'hui, le maximum). Les autres sont à 42 %.
- `goal` et `goalLabel` : une ligne pointillée d'objectif.
- `format(v)` : format des valeurs dans l'info-bulle (« 64 € »).
- `height` (140 px par défaut), `title` (lu par les lecteurs d'écran).

**Ce qui est déjà géré :**
- Barres fines, arrondies de 4 px en haut, collées à la ligne de base, 2 px d'écart.
- Info-bulle au survol de toute la colonne (pas seulement de la barre).
- Un tableau caché reprend les données pour les lecteurs d'écran.

**Règles :**
- Une seule série par graphique. Pour comparer deux mesures, faire deux graphiques.
- Pas de chiffre sur chaque barre : le total ou la moyenne va au-dessus du graphique, le détail dans l'info-bulle.
