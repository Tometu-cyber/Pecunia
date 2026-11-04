# GlassButton

Le bouton capsule Liquid Glass, pour les actions qui flottent au-dessus du contenu : ajouter, rechercher, modifier.

**Props :**
- `icon` : pictogramme. Sans texte, c'est un bouton rond de 44 px, et `label` devient obligatoire (lecteur d'écran).
- `children` : le texte du bouton, verbe d'abord (« Ajouter une dépense »).
- `prominent` : bouton plein à la couleur de l'app au lieu du verre. **Un seul par écran**, pour l'action principale.
- `app` : couleur utilisée par `prominent` et le focus (`portail` = bleu système).
- `size` : `regular` (44 px, mobile) ou `small` (28 px, barre d'outils macOS).
- `href` : le bouton devient un lien (`<a>` ou `linkAs`), mêmes styles. `disabled` : estompé, sans action.

**Règles :**
- En verre seulement s'il est posé sur la couche de navigation ou flotte au-dessus du contenu. Dans une carte, utiliser un bouton simple (à venir).
- Pas de verre sur du verre : dans une barre en verre, les boutons sont transparents.
- Sur mobile, préférer `regular`. Si `small` est utilisé, sa zone tactile est quand même agrandie à 44 × 44 px.
