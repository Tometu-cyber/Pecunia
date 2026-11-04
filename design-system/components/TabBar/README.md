# TabBar

La barre d'onglets flottante en verre, en bas de l'écran sur mobile. C'est la navigation principale du portail sur iPhone.

**Props :**
- `items` : `[{ id, label, icon, href? }]`, 3 à 5 onglets. Libellés d'un seul mot. Avec `href`, l'onglet est un lien.
- `active` / `defaultActive` / `onChange` : onglet sélectionné, contrôlé ou non.
- `action` : `{ icon, label, onClick, href?, prominent? }`, un bouton rond à droite de la barre : en verre (recherche, comme dans les apps Apple d'iOS 26), ou plein à la couleur de l'app avec `prominent` (ajout rapide, comme le « + » de Pecunia).
- `app` : dans une app, l'onglet actif prend la couleur de texte de l'app (`<app>-text`) au lieu du bleu.
- `draggable` : active la barre glissable façon iOS 26 (voir plus bas). Sans cette option, la barre garde son comportement simple.
- `linkAs` : composant de lien pour les `href` de cette barre.

**Mise en page :**
- Position fixe en bas, à `space-4` des bords et au-dessus de la zone de sécurité (`env(safe-area-inset-bottom)`).
- Le contenu défile dessous : ajouter un padding bas de `tabbar-height` + `space-8` au contenu.
- Au défilement vers le bas, la barre peut se réduire à l'onglet actif (à prévoir côté app).

**Règles :**
- Sur ordi (au-delà de 768 px), elle est remplacée par la `Sidebar`.
- Icônes et texte monochromes, sauf l'onglet actif.

**Contraste :** dans une app, l'onglet actif est en `<app>-text`, pas en `<app>`. Le texte et le trait fin du pictogramme sont posés sur du verre clair : le vert ou le jaune plein y tombent vers 2:1, alors que `<app>-text` garde 4,5:1. Le portail garde son bleu.

**Barre glissable (`draggable`) :**
- Une pastille grise glisse sous l'onglet actif et remplace son fond.
- On peut poser le doigt sur la barre et glisser : au-delà de 8 px, la pastille suit le doigt et grossit (×1,1), et l'onglet survolé passe en `<app>-text`. Au lâcher, l'onglet survolé s'ouvre, par un vrai clic, donc son `href` ou son `onChange`. Un simple toucher reste un toucher.
- Petite vibration en changeant d'onglet et au lâcher, si l'appareil le permet (`navigator.vibrate`).
- Ressort `cubic-bezier(.3, 1.25, .5, 1)` en 340 ms. Avec « Réduire les animations », pas de transition ni d'agrandissement.
- En mode contrôlé (`active`), l'onglet choisi au doigt s'affiche tout de suite, en attendant que la nouvelle page donne le nouvel `active`.

**Dans le layout :** poser la barre dans un conteneur `pt-tabbar-dock` (fixe, en bas, à `space-4` des bords, au-dessus de la zone de sécurité).
