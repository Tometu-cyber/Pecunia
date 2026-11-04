# TextField

Le champ de saisie : libellé au-dessus, fond gris doux, contour à la couleur de l'app quand on écrit, et un message d'aide ou d'erreur en dessous.

**Props :**
- `label` : libellé au-dessus (obligatoire sauf en recherche).
- `placeholder` : un exemple réel (« 0,00 », « Courses Carrefour »), jamais le libellé répété.
- `suffix` : unité à droite (« € », « min », « kcal »).
- `hint` : aide courte. `error` : message d'erreur, qui remplace l'aide et passe le contour en rouge.
- `variant: 'search'` : capsule avec loupe.
- `size: 'small'` : 28 px de haut, pour l'ordi.
- `app`, `type`, `inputMode` (`decimal` pour les montants), `value`, `defaultValue`, `onChange(value)`.

**Règles :**
- 44 px de haut sur mobile, 28 px sur ordi.
- L'erreur dit quoi faire : « Entre une durée supérieure à 0. », pas « Valeur invalide ».
- Sur iPhone, le texte saisi reste à 17 px : en dessous, Safari zoome sur le champ.

**Champ date sur iPhone :** avec `type: 'date'` (ou `time`, `datetime-local`, `month`), le champ perd l'apparence native. Safari collait la valeur en haut et la centrait. Elle est maintenant alignée à gauche et centrée verticalement comme dans les autres champs, et le champ ne déborde plus de son conteneur (`min-width: 0`). Le calendrier natif s'ouvre toujours au toucher.
