# 2. Design tokenek és fontok

A Tailwind v4-ben **nincs már `tailwind.config.js`**. A beállítások CSS-ben vannak, a `@theme` blokkban. Minden változó, amit ott megadsz, automatikusan utility class lesz:

| Ezt írod a `@theme`-be | Ezt kapod |
|---|---|
| `--color-navy: #0B1630;` | `bg-navy`, `text-navy`, `border-navy`, ... |
| `--ease-brand: cubic-bezier(...)` | `ease-brand` |
| `--shadow-card: ...` | `shadow-card` |

Így a CLAUDE.md token táblázata egy az egyben class nevekké válik.

## 2.1 `app/globals.css`

Cseréld le a teljes tartalmát erre:

```css
@import "tailwindcss";

/* Design tokenek a CLAUDE.md alapján */
@theme {
  --color-page: #edf0f4;
  --color-surface: #fbfcfd;
  --color-surface-muted: #f3f5f8;
  --color-ink: #0b1220;
  --color-navy: #0b1630;
  --color-navy-line: #22304f;
  --color-navy-input: #111f3f;
  --color-navy-input-border: #33456b;
  --color-text-strong: #3a4658;
  --color-text-muted: #4a5568;
  --color-on-navy: #f4f6fa;
  --color-on-navy-muted: #c3ccda;
  --color-on-navy-label: #a8b3c7;
  --color-on-navy-link: #d5dce7;
  --color-border: #d8dee6;
  --color-border-form: #cdd5df;
  --color-border-list: #c9d1dc;
  --color-border-inner: #e3e8ee;
  --color-row-hover: #f6f8fa;
  --color-accent: #4ade80;
  --color-on-accent-muted: #12301f;

  --ease-brand: cubic-bezier(0.16, 1, 0.3, 1);

  --shadow-card: 0 24px 44px -20px rgb(11 22 48 / 0.32);
  --shadow-brand: 0 30px 60px -30px rgb(11 22 48 / 0.6);
}

/* A fontok CSS változóit a next/font adja (layout.tsx).
   Az "inline" azt jelenti, hogy a utility közvetlenül a var(--font-...) értéket kapja. */
@theme inline {
  --font-sans: var(--font-onest), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-archivo), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-dm-mono), ui-monospace, monospace;
}

/* ---------- Saját utility-k ---------- */

@utility wrap {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 24px;
}

/* Display címek: Archivo 800, szélesített (font-stretch 112%) */
@utility font-headline {
  @apply font-display font-extrabold;
  font-stretch: 112%;
}

@utility type-h1 {
  font-size: clamp(44px, 5vw, 68px);
  line-height: 1;
  letter-spacing: -0.04em;
}

@utility type-h1-product {
  font-size: clamp(52px, 7vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.045em;
}

@utility type-h2 {
  font-size: clamp(36px, 4.2vw, 56px);
  line-height: 1;
  letter-spacing: -0.035em;
}

@utility type-band {
  font-size: clamp(40px, 5vw, 72px);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

/* Kiemelő filc csík az "in public." alatt */
@utility highlight {
  padding-inline: 4px;
  background: linear-gradient(
    transparent 58%,
    var(--color-accent) 58%,
    var(--color-accent) 90%,
    transparent 90%
  );
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* ---------- Alapstílusok ---------- */

@layer base {
  html {
    background-color: var(--color-page);
    color: var(--color-ink);
    -webkit-font-smoothing: antialiased;
  }

  :focus-visible {
    outline: 2px solid var(--color-ink);
    outline-offset: 3px;
  }

  /* Sötét paneleken a fekete fókuszkeret nem látszana */
  [data-surface="dark"] :focus-visible {
    outline-color: var(--color-accent);
  }

  ::selection {
    background-color: var(--color-accent);
    color: var(--color-ink);
  }
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }

  /* A GSAP ezeket úsztatja be (8. fejezet). Addig rejtve vannak, hogy ne villanjanak. */
  [data-hero-item] {
    visibility: hidden;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Mit tanulsz ebből?

- **`@theme` vs `@theme inline`:** a sima `@theme` értékei CSS változóként a `:root`-ra kerülnek. A fontoknál `inline` kell, mert a `--font-archivo` változót a `next/font` egy class-szal teszi a `<html>` elemre, és azt akarjuk, hogy a utility az elem szintjén oldja fel.
- **`@utility`:** saját class, ami ugyanúgy működik variánsokkal, mint a beépítettek (`md:type-h2`, `hover:highlight`).
- **`@apply`** a `@utility`-n belül: meglévő utility-ket húz be.
- **`font-stretch: 112%`:** az Archivo változtatható font, van szélesség tengelye (`wdth`). Ettől lesznek a címek olyan szélesek, mint a terven.

## 2.2 `app/layout.tsx`

Cseréld le a teljes tartalmát:

```tsx
import type { Metadata } from "next";
import { Archivo, DM_Mono, Onest } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Laci Builds: small SaaS tools, built in public",
    template: "%s | Laci Builds",
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${onest.variable} ${dmMono.variable}`}
    >
      <body className="font-sans text-ink">
        {children}
        {/* JS nélkül ne maradjon láthatatlan a hero */}
        <noscript>
          <style>{"[data-hero-item]{visibility:visible!important}"}</style>
        </noscript>
      </body>
    </html>
  );
}
```

### Mit tanulsz ebből?

- **`axes: ["wdth"]`:** az Archivónak csak akkor töltődik le a szélesség tengelye, ha kéred. Enélkül a `font-stretch` hatástalan.
- **`variable`:** a font nem közvetlenül class-ként kerül fel, hanem CSS változóként (`--font-archivo`), amit a `globals.css` használ.
- **`metadataBase`:** ebből számolja a Next.js az abszolút URL-eket (canonical, Open Graph). A `site.url` a következő fejezetben készül.
- **`title.template`:** az aloldalak csak a saját címüket adják meg ("CrawlGuard"), a Next.js hozzáfűzi: "CrawlGuard | Laci Builds".

> A `lib/site.ts` még nem létezik, ezért most hibát fogsz látni. A 3. fejezet első lépése pont ez a fájl.

## 2.3 Ideiglenes kezdőlap a teszteléshez

Cseréld le az `app/page.tsx` tartalmát egy próbára:

```tsx
export default function HomePage() {
  return (
    <main className="wrap py-12">
      <h1 className="font-headline type-h1">
        Small SaaS tools, built <span className="highlight">in public.</span>
      </h1>
      <p className="mt-6 font-mono text-[14px] text-text-muted">DM Mono teszt</p>
      <p className="mt-2 text-[20px] text-text-strong">Onest szövegtörzs teszt</p>
    </main>
  );
}
```

## Ellenőrzés

(A 3.1 lépés, a `lib/site.ts` után.)

- [ ] a háttér világos szürkéskék (`#EDF0F4`)
- [ ] a cím széles, nagyon vastag Archivo, a "in public." alatt zöld csík van
- [ ] DevToolsban a `<h1>` Computed fülén a `font-stretch` értéke `112%`
- [ ] a mono sor DM Mono, a szövegtörzs Onest
- [ ] a Network fülön a fontok a saját domainről (`/_next/static/media/...`) jönnek, nem a `fonts.googleapis.com`-ról
