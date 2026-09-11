# Singular Bear Studio — website

Site vitrine du studio Singular Bear : catalogue d'assets Unity, documentation des manuels et démos jouables (Unity WebGL) pour les packs vendus sur l'Unity Asset Store. Les achats se finalisent sur l'Asset Store — ce site sert de vitrine, de centre de démonstration et de documentation.

## Stack

- [Next.js](https://nextjs.org) (App Router) exécuté via [vinext](https://www.npmjs.com/package/vinext) sur [Vite](https://vitejs.dev)
- TypeScript strict, React 19
- Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com)
- Déploiement [Cloudflare Workers](https://workers.cloudflare.com) via `wrangler`
- Lint/format via [oxlint](https://oxc.rs/docs/guide/usage/linter.html) / [oxfmt](https://oxc.rs)

## Prérequis

- Node.js >= 22.13.0

## Démarrage

```bash
npm install
npm run dev
```

## Scripts

| Commande         | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `npm run dev`    | Serveur de développement (`vinext dev`)                          |
| `npm run build`  | Build de production (`vinext build`)                             |
| `npm start`      | Sert le build via `wrangler dev` (simulateur Cloudflare Workers) |
| `npm run lint`   | Lint du code (`oxlint`)                                          |
| `npm run format` | Formatage du code (`oxfmt`)                                      |

## Structure du projet

- `src/app` — routes, métadonnées SEO, sitemap/robots.
- `src/features` — composants métier (accueil, catalogue, documentation).
- `src/components` — briques partagées (layout, media, motion, thème, `ui/` = shadcn).
- `src/lib` — données produits/manuels et utilitaires.
- `src/webplayer` — configuration et logique des démos Unity WebGL.
- `public/webplayer` — exports Unity WebGL servis par le site (voir `public/webplayer/README.md`).
- `webplayer/source-builds` — archives ZIP originales des builds Unity WebGL (non déployées).
- `doc/` — documentation interne (voir ci-dessous).

Détails complets : [`doc/architecture.md`](doc/architecture.md).

## Mettre à jour le contenu

Ajouter un produit, une vidéo ou un export Unity WebGL : voir [`doc/content-workflow.md`](doc/content-workflow.md).

## Notes

- `vinext` est encore en version bêta ; surveiller les mises à jour avant de dépendre de fonctionnalités avancées.
- Aucun test automatisé n'est en place actuellement.
