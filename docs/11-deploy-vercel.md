# 11. Deploy a Vercelre

## 11.1 Production build helyben

Mielőtt feltöltöd, nézd meg, hogy élesben is működik:

```bash
npm run lint
npm run build
npm run start
```

Az `npm run start` a production buildet szolgálja ki a http://localhost:3000 címen. Itt már **nem látszanak a vázlat posztok**, és a build log szekció eltűnik a kezdőlapról. Ez a helyes működés.

## 11.2 GitHub

1. Hozz létre egy üres repót a GitHubon (pl. `lacibuilds`), README nélkül.
2. Töltsd fel:

```bash
git add .
git commit -m "Build home, product, blog and 404 pages"
git branch -M main
git remote add origin https://github.com/<felhasznalonev>/lacibuilds.git
git push -u origin main
```

Előtte nézd meg a `git status`-ban, hogy a `.env.local` **nincs** a listában.

## 11.3 Vercel

1. https://vercel.com, belépés GitHubbal, a **Hobby** (ingyenes) csomag.
2. **Add New... > Project**, válaszd ki a `lacibuilds` repót.
3. A Framework Preset automatikusan Next.js lesz. A build beállításokhoz ne nyúlj.
4. **Environment Variables:** egyelőre hagyd üresen (lásd lent).
5. **Deploy.**

Pár perc múlva kapsz egy `https://lacibuilds-xxxx.vercel.app` címet. Ettől kezdve minden `git push` a `main` ágra automatikusan új élesítést indít, minden más ágra pedig preview URL-t kapsz.

## 11.4 Környezeti változók (amikor kiválasztottad a szolgáltatót)

Vercel > Project > **Settings > Environment Variables**:

| Név | Érték |
|---|---|
| `NEWSLETTER_API_KEY` | a szolgáltató API kulcsa |
| `NEWSLETTER_ENDPOINT` | pl. `https://api.buttondown.com/v1/subscribers` |
| `NEWSLETTER_TAG` | `newsletter` |
| `WAITLIST_TAG` | `crawlguard-waitlist` |
| `NEXT_PUBLIC_SITE_URL` | csak ha már van saját domain, pl. `https://lacibuilds.com` |

Változó módosítása után a Deployments fülön indíts **Redeploy**-t, mert a változók build időben kerülnek be.

> Amíg nincs API kulcs, élesben az űrlap az általános hibaüzenetet adja ("Something went wrong"). Ezért **a szolgáltató kiválasztása a launch előtti utolsó blokkoló lépés.**

## 11.5 Launch előtti ellenőrzőlista

A CLAUDE.md "Placeholders" és "Quality bar" részéből:

**Tartalom**

- [ ] profilkép: `public/laci.jpg` és `site.avatar`
- [ ] social URL-ek a `lib/site.ts`-ben
- [ ] kapcsolati email (`site.email`), ettől jelenik meg a FAQ bevezető
- [ ] CrawlGuard ár, vagy döntés, hogy a "Price" sor egyelőre ne látszódjon
- [ ] "Revenue: $0/mo, for now": marad vagy törlöd
- [ ] legalább egy publikált poszt, ha szeretnéd, hogy a build log látszódjon
- [ ] keress rá az egész projektben a `[` és a `TODO` szövegre, és a `—` / `–` karakterre (kötőjeles gondolatjel nem lehet a szövegben)
- [ ] sehol nem szerepel a "ShipCheck Lite"

**Minőség**

- [ ] Lighthouse (Chrome DevTools > Lighthouse, Mobile): Performance, Accessibility, SEO 90 fölött
- [ ] 360px-től nincs vízszintes görgetés (DevTools eszköz mód, 360 széles)
- [ ] csak billentyűzettel végig lehet menni az oldalon, mindenhol látszik a fókusz
- [ ] reduced motion mellett semmi nem mozog
- [ ] az űrlap mind a négy állapota működik élesben, valódi email címmel
- [ ] a `https://<projekt>.vercel.app/sitemap.xml` a vercel.app címet tartalmazza, nem a localhostot

**Opcionális**

- [ ] Vercel Web Analytics (ingyenes): `npm i @vercel/analytics`, majd a `layout.tsx` `<body>`-jába `<Analytics />` (`import { Analytics } from "@vercel/analytics/next"`), és a Vercelen a projekt Analytics fülén engedélyezd.

## Ha elakadsz

- **Build hiba a Vercelen, de helyben működik:** szinte mindig kis- és nagybetű különbség egy importban. A Windows nem különbözteti meg (`header.tsx` és `Header.tsx`), a Vercel Linuxa igen.
- **"Module not found: Can't resolve 'fs'":** egy `'use client'` komponens a `lib/posts.ts`-t importálja. A posztokat a server komponens olvassa be, és propként adja tovább.
- **A fontok nem szélesek:** ellenőrizd, hogy a `layout.tsx`-ben ott van-e az `axes: ["wdth"]`.
