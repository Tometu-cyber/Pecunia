# AppTile

La tuile d'une app sur l'accueil du portail : icône, nom, un chiffre clé et une ligne de détail, avec une jauge facultative. Un tap ouvre l'app.

**Props :**
- `app` : l'app (couleur et icône).
- `name` : nom de l'app.
- `value` : le chiffre clé, en police arrondie (« 1 240 € », « 3/4 », « J-4 »). Court : 8 caractères maximum.
- `detail` : ce que le chiffre veut dire (« Disponible ce mois »).
- `progress` : 0 à 1, affiche une jauge à la couleur de l'app.
- `variant` : `plain` (par défaut, carte blanche) ou `tinted` (fond teinté `<app>-bg`, chiffre en `<app>-text`).
- `onClick` : ouvre l'app.

**Règles :**
- Grille de 2 colonnes sur iPhone (écart `space-3`), 3 ou 4 sur ordi (écart `space-6`).
- Une ou deux tuiles `tinted` maximum par écran, pour l'app qui demande ton attention (échéance proche, objectif atteint). Les autres restent `plain`.
- Jamais de verre sur une tuile : c'est du contenu.
- Le chiffre doit être lisible en un coup d'œil. S'il faut une phrase, c'est le `detail`.
