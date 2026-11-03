# ProgressRing

Les anneaux de progression, comme dans l'app Forme : un à trois anneaux concentriques, chacun à la couleur de son app, avec une légende à droite.

**Props :**
- `rings` : `[{ app, value (0 à 1), label, display? }]`, de l'extérieur vers l'intérieur. `display` remplace le pourcentage dans la légende (« 3/4 »).
- `size` : diamètre en px (132 par défaut). L'épaisseur suit (11 %).
- `center` : `{ value, label }` au centre, pour un anneau seul (« 59 % dépensé »).
- `legend` : `false` pour la masquer. Elle est automatique dès 2 anneaux.

**Règles :**
- 3 anneaux maximum. Au-delà, utiliser une liste.
- La piste est la couleur de l'anneau à 20 %. Les valeurs au-delà de 100 % s'affichent pleines : écrire la vraie valeur dans `display`.
- Les chiffres de la légende sont en texte normal, pas en couleur : le point de couleur fait le lien.
