# Laci Builds: építési útmutató (Next.js + Tailwind v4 + GSAP)

Ez az útmutató lépésről lépésre végigvezet a v3 design megépítésén. A kódot te írod be. Minden fejezet végén van egy **Ellenőrzés** rész: ott derül ki, hogy minden jól működik-e, mielőtt továbbmész.

## Sorrend

| # | Fájl | Mit építesz |
|---|---|---|
| 1 | `01-projekt-letrehozasa.md` | Next.js projekt, csomagok, mappaszerkezet |
| 2 | `02-design-tokenek-es-fontok.md` | Színek, fontok, tipográfia, alapstílusok |
| 3 | `03-fejlec-es-lablec.md` | Logó, gombok, Header, Footer, oldaladatok |
| 4 | `04-adatok.md` | Termékek (TypeScript) és posztok (Markdown) |
| 5 | `05-kartyak-es-sorok.md` | StatusBadge, LogoTile, ProductCard, BuildLogRow |
| 6 | `06-urlapok.md` | Feliratkozó űrlap, Server Action, 4 állapot |
| 7 | `07-kezdolap.md` | Hero, BrandCard, könyvtár, build log, SubscribeBand |
| 8 | `08-gsap-animacio.md` | Hero belépő animáció GSAP-pal, reduced motion |
| 9 | `09-termekoldal.md` | `/products/[slug]`: AtAGlance, HowItWorks, FAQ, WaitlistBand |
| 10 | `10-blog-404-seo.md` | `/blog`, `/blog/[slug]`, 404, sitemap, robots, metaadatok |
| 11 | `11-deploy-vercel.md` | GitHub, Vercel, környezeti változók, végső ellenőrzőlista |

## Ahogy felépül a projekt

```
lacibuilds/
├─ app/
│  ├─ layout.tsx              gyökér layout: fontok, alap metaadatok
│  ├─ globals.css             Tailwind + design tokenek
│  ├─ page.tsx                kezdőlap
│  ├─ actions.ts              Server Action az űrlapokhoz
│  ├─ not-found.tsx           404
│  ├─ sitemap.ts, robots.ts
│  ├─ products/[slug]/page.tsx
│  └─ blog/page.tsx, blog/[slug]/page.tsx
├─ components/                újrahasznosítható UI darabok
├─ content/
│  ├─ products.ts             termékadatok, típusokkal
│  └─ posts/*.md              build log posztok
├─ lib/                       segédfüggvények (posts, site, styles, newsletter, seo)
├─ public/                    képek (pl. a profilképed)
└─ docs/                      ez az útmutató
```

## Pár döntés, amit érdemes tudni

- **Server és client komponensek.** A Next.js App Routerben minden komponens alapból *server component*: a szerveren renderelődik, és nem kerül belőle JavaScript a böngészőbe. Csak ott írunk `'use client'`-et, ahol tényleg kell böngészős JS: az űrlapnál (állapot) és a GSAP animációnál. Ezért lesz gyors az oldal.
- **Hover effektek CSS-ben, a belépő animáció GSAP-pal.** Egy hoverhez nem kell JavaScript, a CSS `transition` olcsóbb és egyszerűbb. A GSAP ott hasznos, ahol idővonal és késleltetett sorrend van (a hero elemek egymás után úsznak be).
- **Fontok `next/font/google`-lel.** A CLAUDE.md a Fontsource-ot írja, mert Astróra készült. A `next/font` ugyanazt adja: **build időben letölti és saját domainről szolgálja ki** a fontot (nincs Google Fonts `<link>`), és automatikusan preloadol, illetve méretkorrigált fallbacket készít, így nem ugrik a layout. Next.js alatt ez a bevett megoldás.
- **Placeholder szöveg nem kerül ki.** Ahol még hiányzik egy adat (fotó, social linkek, email, ár), ott a kód üres értéket kap, és az üres elem egyszerűen nem jelenik meg. Szögletes zárójeles szöveg így véletlenül sem kerül élesbe.

## Nyitott kérdések (ezeket neked kell eldöntened)

1. **Hírlevél szolgáltató:** Buttondown, Kit vagy Beehiiv? Az útmutató Buttondown példát ad, de egyetlen fájlt kell átírni a cseréhez (`lib/newsletter.ts`).
2. **A könyvtár rács 3 termékkel:** a tervben 9 kártya van, ebből 6 placeholder. Három kártya desktopon pont egy sort ad, így jól mutat. Ha szeretnél mellé valami "coming soon" jellegű elemet, azt külön kell megtervezni.
3. **Hiányzó adatok:** profilkép, social URL-ek, kapcsolati email, CrawlGuard ár, posztok és dátumok, illetve hogy maradjon-e a "Revenue: $0/mo, for now".
4. **Vercel Web Analytics** (ingyenes csomag): kéred-e.

Ha valami nem működik, másold be a hibaüzenetet, és megnézzük együtt.
