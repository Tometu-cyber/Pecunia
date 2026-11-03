# LineChart

Le graphique en courbe pour une seule série qui évolue dans le temps : le solde, le poids, les calories de la semaine. Le trait est à la couleur de l'app, avec un fond dégradé facultatif.

**Ce qui est déjà géré :**
- Un point et une étiquette sur la dernière valeur (ou sur `highlight`). Au survol ou au doigt, une ligne verticale suit le curseur, et l'étiquette affiche la valeur et la date du point le plus proche.
- 3 lignes de repère discrètes, avec leurs valeurs à droite.
- 4 ou 5 dates en bas, jamais superposées. La dernière est toujours affichée.
- Un tableau caché reprend les données pour les lecteurs d'écran.

**Props :**
- `data` : `[{ label, value }]`, dans l'ordre chronologique.
- `app`, `height` (160 px par défaut), `title` (lu par les lecteurs d'écran).
- `format(v)` : format des valeurs (« 1 420 € », « 72,9 kg »).
- `area: false` : sans fond dégradé (quand la valeur absolue compte moins que la tendance, comme le poids).
- `goal`, `goalLabel` : ligne d'objectif en pointillés.
- `min`, `max` : bornes de l'échelle (sinon calculées avec une marge). `ticks` : valeurs des lignes de repère. `labelEvery` : une date sur combien. `highlight` : index du point mis en avant.

**Règles :**
- Une seule courbe par graphique, jamais deux échelles. Pour comparer, faire deux graphiques.
- Le chiffre clé (valeur actuelle et évolution) va au-dessus du graphique, en gros, comme dans l'exemple « Solde ».
- Pour comparer des jours ou des catégories entre eux, utiliser `BarChart`. La courbe sert à montrer une tendance.
