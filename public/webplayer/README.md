# Unity WebGL builds

Déposer chaque export dans un sous-dossier portant le slug du pack ou du produit, par exemple `public/webplayer/pro-glass-shader` ou `public/webplayer/2d-environment-meadow`.

Chaque build doit conserver son fichier `index.html`, son dossier `Build` et son dossier `TemplateData`. Le bouton `Launch Web Player` apparaît automatiquement après le prochain build du site. Le lecteur ouvre le jeu dans une fenêtre plein écran avec prise en charge du mode fullscreen et des manettes.

Conserver l'archive ZIP originale dans `webplayer/source-builds`. Les exports Brotli doivent être servis avec les bons en-têtes HTTP ou être décompressés avant publication.
