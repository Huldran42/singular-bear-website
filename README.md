# Singular Bear Studio — website

Site vitrine du studio Singular Bear : catalogue d'assets Unity, documentation des manuels et démos jouables (Unity WebGL) pour les packs vendus sur l'Unity Asset Store. Les achats se finalisent sur l'Asset Store — ce site sert de vitrine, de centre de démonstration et de documentation.

## Stack

- [Next.js](https://nextjs.org) 15 (App Router) + React 19
- TypeScript strict
- Tailwind CSS 4
- Déploiement [Vercel](https://vercel.com)
- Lint/format via [oxlint](https://oxc.rs/docs/guide/usage/linter.html) / [oxfmt](https://oxc.rs)

## Prérequis

- Node.js 22 (voir `.nvmrc`)

## Démarrage

```bash
cp .env.example .env.local
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Copier `.env.example` vers `.env.local` en local, et les renseigner dans **Vercel → Project → Settings → Environment Variables**.

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | Origine canonique (sitemap, Open Graph, JSON-LD). En preview Vercel, l'app utilise `https://$VERCEL_URL` si cette variable est vide. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Non | Email affiché sur Support. Défaut : `singularbear.studio@gmail.com`. |
| `NEXT_PUBLIC_PAYPAL_URL` | Non | Lien de don. Si vide, le bouton PayPal est masqué. |
| `NEXT_PUBLIC_ASSET_STORE_URL` | Non | Page éditeur Unity Asset Store. |
| `NEXT_PUBLIC_ARTSTATION_URL` | Non | Profil ArtStation. |

Ne jamais committer `.env.local`.

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement Next.js |
| `npm run build` | Build de production |
| `npm start` | Sert le build Next.js |
| `npm run lint` | Lint (`oxlint`) |
| `npm run format` | Formatage (`oxfmt`) |

## Aperçu Vercel

1. Pousser le dépôt sur GitHub.
2. Importer le projet sur [vercel.com/new](https://vercel.com/new).
3. Framework : Next.js (détecté).
4. Renseigner `NEXT_PUBLIC_SITE_URL` pour la Production (ex. `https://singularbear.studio`).
5. Chaque push ouvre une Preview URL.

En CLI, après `npx vercel login` :

```bash
npx vercel
```

## Structure

- `src/app` — routes, métadonnées SEO, sitemap/robots.
- `src/features` — composants métier (accueil, catalogue, documentation, packs, support).
- `src/components` — layout, média, thème.
- `src/lib` — données produits/manuels, URL du site, détection WebGL.
- `src/webplayer` — configuration des démos et lecteur Unity.
- `public/webplayer` — exports Unity WebGL servis par le site.
- `doc/` — documentation interne.

Détails : [`doc/architecture.md`](doc/architecture.md).

## Mettre à jour le contenu

Ajouter un produit, une vidéo ou un export Unity WebGL : [`doc/content-workflow.md`](doc/content-workflow.md).
