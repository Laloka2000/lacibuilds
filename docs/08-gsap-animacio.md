# 8. Hero animáció GSAP-pal

A CLAUDE.md ezt kéri:

> Hero elements fade up on load (opacity 0 → 1, translateY 18px → 0, 0.9s), staggered at 0.06s, 0.14s, 0.22s and 0.32s. Easing: `cubic-bezier(.16,1,.3,1)`. Everything is disabled under `prefers-reduced-motion: reduce`.

## 8.1 Hogyan illeszkedik a GSAP a Next.js-be

- A GSAP a böngészőben fut, és DOM elemeket mozgat, ezért **client komponens** kell (`'use client'`).
- A `useGSAP` hook a `useEffect` GSAP-os változata: lefuttatja az animációt, és amikor a komponens eltűnik, mindent visszaállít (ez a "cleanup"). React Strict Mode alatt fejlesztéskor kétszer fut le, ez normális.
- A `scope` opció miatt a `"[data-hero-item]"` szelektor **csak a komponensen belül** keres, nem az egész oldalon.
- A `gsap.matchMedia()` egy media querytől teszi függővé az animációt. Ha a felhasználó reduced motiont kér, az animáció le sem fut.

## 8.2 A villanás elkerülése

Probléma: a szerver kész HTML-t küld, a böngésző azonnal kirajzolja. A GSAP csak utána töltődik be, elrejti az elemeket, majd beúsztatja őket. Ettől egy pillanatra minden villan.

Megoldás (ezt már beírtad a 2. fejezetben):

```css
@media (prefers-reduced-motion: no-preference) {
  [data-hero-item] { visibility: hidden; }
}
```

A CSS az első kirajzolástól kezdve rejti az elemeket. A GSAP `autoAlpha` tulajdonsága pedig egyszerre állítja az `opacity`-t és a `visibility`-t, így amikor az animáció elindul, láthatóvá teszi őket. A `<noscript>` blokk a layoutban gondoskodik róla, hogy JavaScript nélkül is látszódjon minden.

## 8.3 `components/HeroReveal.tsx` (végleges)

Cseréld le a 7. fejezet ideiglenes változatát:

```tsx
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, CustomEase);

// A data-hero-item="0..3" értékhez tartozó késleltetés másodpercben
const DELAYS = [0.06, 0.14, 0.22, 0.32];

type HeroRevealProps = {
  children: React.ReactNode;
  className?: string;
};

export function HeroReveal({ children, className }: HeroRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Ugyanaz a görbe, mint a CSS-ben a --ease-brand
        CustomEase.create("brand", ".16,1,.3,1");

        gsap.fromTo(
          "[data-hero-item]",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "brand",
            delay: (_index: number, el: HTMLElement) => DELAYS[Number(el.dataset.heroItem)] ?? 0,
            clearProps: "transform",
          },
        );
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
```

### Sorról sorra

| Kód | Mit csinál |
|---|---|
| `gsap.registerPlugin(useGSAP, CustomEase)` | regisztrálja a plugineket. A modul tetején egyszer elég. |
| `useRef<HTMLDivElement>(null)` | hivatkozás a wrapper `<div>`-re, ez lesz a `scope` |
| `gsap.matchMedia()` + `mm.add(query, fn)` | az `fn` csak akkor fut, ha a query igaz. Ha a beállítás menet közben változik, a GSAP visszaállítja az elemeket. |
| `CustomEase.create("brand", ".16,1,.3,1")` | a GSAP-ban nincs `cubic-bezier`, a CustomEase-zel a CSS görbe pontosan átvihető |
| `fromTo(cél, honnan, hova)` | kifejezetten megadjuk a kezdő és a cél állapotot is |
| `autoAlpha` | `opacity` + `visibility` egyszerre. 0-nál `visibility: hidden`, így nem is kattintható. |
| `y: 18` | `translateY(18px)`, a GSAP `transform`-ot animál, ahogy a CLAUDE.md kéri |
| `delay: (index, el) => ...` | függvény is lehet érték: minden elemre külön lefut. A késleltetést a `data-hero-item` számából olvassuk ki. |
| `el.dataset.heroItem` | a `data-hero-item` attribútum értéke. A kötőjeles nevekből camelCase lesz. |
| `clearProps: "transform"` | a végén eltávolítja az inline `transform`-ot, ne maradjon felesleges stílus az elemen |

### Miért nem `stagger`?

A GSAP-ban van `stagger: 0.08` opció, ami egyenletes lépésközt ad. A tervben a lépésköz nem egyenletes (0.08, 0.08, 0.10), és két elem (az űrlap és a BrandCard) **ugyanakkor** indul. Ezért függvényből számoljuk a késleltetést.

## 8.4 A termékoldalon is működni fog

A 9. fejezetben a termékoldal hero is `HeroReveal`-be kerül, saját `data-hero-item` elemekkel. A komponens nem tudja, mit animál, csak a `data-hero-item` jelölésű gyerekeit keresi. Ettől újrahasznosítható.

## 8.5 Teljesítmény: mire figyelj

- A hero cím a **Largest Contentful Paint** (LCP) elem. Amíg rejtve van, a böngésző nem számolja kirajzoltnak. A 0.14s késleltetés a mérésben kicsi, de ha valaha lassúnak mérné a Lighthouse, ez az első gyanúsított. Ilyenkor a megoldás: a h1-ről levenni a `data-hero-item`-et, vagy csak az `y`-t animálni rajta.
- A GSAP kb. 25 KB gzipelve, és csak a `HeroReveal`-t tartalmazó oldalakra töltődik be.

## Ellenőrzés

- [ ] oldalbetöltéskor a név sor, a cím, a szöveg, majd az űrlap és a kártya egymás után úszik be alulról
- [ ] nincs villanás: frissítésnél nem jelenik meg semmi az animáció előtt
- [ ] DevTools > Rendering > Emulate `prefers-reduced-motion: reduce`, majd frissítés: minden azonnal látszik, semmi nem mozog
- [ ] DevTools > Settings > Debugger > Disable JavaScript, majd frissítés: a hero tartalma látszik (a `<noscript>` miatt)
