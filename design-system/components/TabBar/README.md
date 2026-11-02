# TabBar

La barre d'onglets flottante en verre, en bas de l'écran sur mobile. C'est la navigation principale du portail sur iPhone.

**Props :**
- `items` : `[{ id, label, icon }]`, 3 à 5 onglets. Libellés d'un seul mot.
- `active` / `defaultActive` / `onChange` : onglet sélectionné, contrôlé ou non.
- `action` : `{ icon, label, onClick, prominent? }`, un bouton rond à droite de la barre : en verre (recherche, comme dans les apps Apple d'iOS 26), ou plein à la couleur de l'app avec `prominent` (ajout rapide, comme le « + » de Pecunia).
- `app` : dans une app, l'onglet actif prend la couleur de l'app au lieu du bleu.

**Mise en page :**
- Position fixe en bas, à `space-4` des bords et au-dessus de la zone de sécurité (`env(safe-area-inset-bottom)`).
- Le contenu défile dessous : ajouter un padding bas de `tabbar-height` + `space-8` au contenu.
- Au défilement vers le bas, la barre peut se réduire à l'onglet actif (à prévoir côté app).

**Règles :**
- Sur ordi (au-delà de 768 px), elle est remplacée par la `Sidebar`.
- Icônes et texte monochromes, sauf l'onglet actif.
