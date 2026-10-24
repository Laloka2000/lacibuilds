# 1. Projekt létrehozása

## 1.1 Next.js projekt

A `C:\projects\lacibuilds` mappában (ahol ez a `docs` mappa is van) futtasd:

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --no-react-compiler --no-cache-components --no-agents-md
```

Mit jelentenek a kapcsolók:

| Kapcsoló | Jelentés |
|---|---|
| `.` | a jelenlegi mappába telepít (a `docs` mappa nem zavarja) |
| `--ts` | TypeScript |
| `--tailwind` | Tailwind CSS v4, már bekötve |
| `--eslint` | linter |
| `--app` | App Router (a modern Next.js routing, `app/` mappa) |
| `--no-src-dir` | nincs `src/` mappa, az `app/` a gyökérben lesz |
| `--import-alias "@/*"` | így tudsz `@/components/Header` alakban importálni a relatív `../../` helyett |
| `--no-cache-components` | egy újabb, haladó cache mód kikapcsolva, hogy most ne bonyolítsa a tanulást |

> Ha a `CLAUDE.md`-t és a `design/` mappát is ide akarod tenni, azt a projekt létrehozása **után** másold be, mert a create-next-app nem enged telepíteni nem üres mappába.

Indítsd el:

```bash
npm run dev
```

Nyisd meg: http://localhost:3000. A Next.js kezdőoldalát kell látnod.

## 1.2 Extra csomagok

```bash
npm i gsap @gsap/react gray-matter marked
```

| Csomag | Mire kell |
|---|---|
| `gsap` | animációs motor. A 3.13-as verzió óta **minden plugin ingyenes** benne, a `CustomEase` is |
| `@gsap/react` | a `useGSAP` hook, ami React alatt automatikusan takarít az animációk után |
| `gray-matter` | a Markdown posztok frontmatter fejlécét olvassa (`title`, `date`, stb.) |
| `marked` | a Markdown szöveget HTML-lé alakítja |

## 1.3 Takarítás

A create-next-app hoz pár demó fájlt, ezekre nincs szükség:

- töröld a `public/` mappa SVG fájljait (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)
- az `app/page.tsx` és az `app/globals.css` tartalmát a következő fejezetekben teljesen lecseréljük

## 1.4 Mappák

Hozd létre az üres mappákat:

```
components/
content/posts/
lib/
```

## 1.5 Git

```bash
git init
git add .
git commit -m "Scaffold Next.js project"
```

(Ha a create-next-app már létrehozta a git repót, az `init` lépést kihagyhatod.)

## 1.6 CLAUDE.md frissítése

A CLAUDE.md-ben a **Stack** rész még Astrót ír. Ha bemásolod a projektbe, írd át, hogy a jövőben ne zavarjon össze:

```markdown
## Stack

- **Next.js (App Router) + Tailwind CSS v4 + GSAP**, deployed on **Vercel**.
- Fonts: `next/font/google` (self-hosted at build time, no Google Fonts `<link>`), Archivo with the `wdth` axis.
- Content: Markdown with frontmatter for posts (`gray-matter` + `marked`), products in `content/products.ts`.
- Hover effects in CSS. GSAP only for the hero entrance animation.
```

és a **Commands** részt:

```markdown
## Commands

- `npm run dev`: dev server on http://localhost:3000
- `npm run build`: production build
- `npm run start`: serve the production build
- `npm run lint`: ESLint
```

## Ellenőrzés

- [ ] `npm run dev` fut, a http://localhost:3000 betölt
- [ ] a `package.json` `dependencies` között ott van a `gsap`, `@gsap/react`, `gray-matter`, `marked`
- [ ] létezik a `components/`, `content/posts/`, `lib/` mappa
