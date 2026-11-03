# DatePicker

Le sélecteur de date compact d'iOS : un bouton gris qui affiche la date (« 6 nov. 2026 ») et ouvre un calendrier dans un panneau en verre. Il existe aussi en calendrier toujours affiché (`inline`).

**Le calendrier :**
- Semaines du lundi au dimanche, mois et jours en français.
- Aujourd'hui en couleur de l'app et en gras.
- Le jour choisi dans une pastille teintée, pleine s'il s'agit d'aujourd'hui.
- Les jours hors du mois sont estompés, les jours hors limites désactivés.

**Props :**
- `value` / `defaultValue` (une `Date`) / `onChange(date)`.
- `label` : libellé au-dessus du bouton. `placeholder` : texte tant qu'aucune date n'est choisie.
- `min`, `max` : limites (une échéance ne peut pas être dans le passé).
- `app` : couleur d'aujourd'hui, du jour choisi et des flèches.
- `size` : `regular` (mobile) ou `small` (ordi).
- `format` : options d'affichage `Intl.DateTimeFormat` (par défaut jour, mois court, année).
- `inline` : calendrier directement dans la page, sans bouton.
- `align: 'end'` : panneau aligné à droite. `today` : remplace la date du jour (tests, aperçus).

**Clavier :** les flèches se déplacent de jour en jour et de semaine en semaine. Page précédente et Page suivante changent de mois, Début et Fin vont au lundi et au dimanche. Entrée choisit le jour, et Échap ou un clic à côté referme le panneau.

**Règles :**
- Formulaire d'ajout : date du jour par défaut, pour n'avoir rien à toucher dans le cas courant.
- Le calendrier `inline` est réservé aux écrans dont la date est le sujet (Agenda, planning des séances).
