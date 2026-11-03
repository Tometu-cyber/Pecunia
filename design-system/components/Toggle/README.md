# Toggle

L'interrupteur d'iOS 26 : une capsule de 63 × 28 px avec une pastille blanche qui glisse. Elle s'étire quand on appuie, comme sur iPhone.

**Props :**
- `label` et `hint` : affiche une ligne complète, texte à gauche et interrupteur à droite. Un tap sur le texte bascule aussi l'interrupteur.
- `ariaLabel` : nom pour les lecteurs d'écran quand l'interrupteur est seul.
- `checked` / `defaultChecked` / `onChange(on)`.
- `app` : couleur de l'interrupteur allumé. Sans `app`, il est vert (`success`), comme les réglages d'iOS.
- `size` : `regular` (mobile) ou `small` (38 × 22 px, ordi).
- `disabled`.

**Règles :**
- Un interrupteur applique son effet tout de suite, sans bouton « Enregistrer ». Pour un choix à valider plus tard, utiliser une case ou un contrôle segmenté.
- Le libellé décrit l'état allumé : « Masquer les montants », pas « Masquer ou afficher les montants ».
- Dans une liste groupée, une ligne par réglage, séparées comme les `ListRow`.
