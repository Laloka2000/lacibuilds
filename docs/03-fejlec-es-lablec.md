# 3. Oldaladatok, logó, gombok, Header, Footer

## 3.1 `lib/site.ts`: az oldal egyetlen igazságforrása

Minden, ami több helyen is kell (URL, social linkek, email), ide kerül. Ha valamit módosítasz, egy helyen teszed.

```ts
const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: "Laci Builds",
  description:
    "Laci Builds is a one-person product studio. Small SaaS tools for developers, built in public.",
  // Saját domain után: NEXT_PUBLIC_SITE_URL=https://... a Vercelen
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (productionUrl ? `https://${productionUrl}` : "http://localhost:3000"),
  // TODO: tedd a fotódat a public/ mappába, és írd ide: "/laci.jpg"
  avatar: null as string | null,
  // TODO: a FAQ bevezetőjében jelenik meg
  email: "",
  handle: "@laci.builds",
  cvUrl: "https://lelovicslaszlo.hu",
};

// TODO: töltsd ki az URL-eket. Az üres link nem jelenik meg az oldalon.
const allSocials = [
  { label: "X", href: "" },
  { label: "GitHub", href: "" },
  { label: "TikTok", href: "" },
  { label: "Instagram", href: "" },
  { label: "Threads", href: "" },
];

export const socials = allSocials.filter((s) => s.href);

export type NavLink = {
  label: string;
  href: string;
  external?: boolean; // új lapon nyílik
  muted?: boolean; // halványabb szín (pl. Developer CV)
};
```

### Mit tanulsz ebből?

- **`VERCEL_PROJECT_PRODUCTION_URL`:** a Vercel build közben automatikusan beállítja (pl. `lacibuilds.vercel.app`). Így domain nélkül is jó canonical URL-eket kapsz.
- **`as string | null`:** a TypeScript különben azt hinné, hogy az `avatar` mindig `null`, és nem engedné stringre állítani.
- **Üres = rejtett:** a `filter` miatt a kitöltetlen social link nem kerül ki az oldalra.

## 3.2 `lib/styles.ts`: gomb stílusok

A gombok több helyen ugyanúgy néznek ki, de néha `<button>`, néha `<Link>`. Ezért nem komponenst, hanem egy class-generáló függvényt írunk.

```ts
const tones = {
  dark: "bg-ink text-on-navy",
  accent: "bg-accent text-ink",
  outline: "border-2 border-ink text-ink",
};

const sizes = {
  sm: "min-h-11 px-6", // 44px: fejléc
  md: "min-h-12 px-6", // 48px: hero űrlap
  lg: "min-h-[52px] px-8", // 52px: sávok
};

export type ButtonTone = keyof typeof tones;
export type ButtonSize = keyof typeof sizes;

export function buttonClass(tone: ButtonTone, size: ButtonSize = "sm") {
  return [
    "inline-flex shrink-0 items-center justify-center rounded-full text-[16px] font-semibold whitespace-nowrap",
    "transition-transform duration-200 ease-brand motion-safe:active:scale-[.97]",
    "disabled:cursor-not-allowed disabled:opacity-60",
    tones[tone],
    sizes[size],
  ].join(" ");
}
```

### Mit tanulsz ebből?

- **`keyof typeof tones`:** a típus automatikusan `"dark" | "accent" | "outline"` lesz. Ha új tónust adsz hozzá, a típus magától frissül.
- **Miért nem `extra` class paraméter?** Mert ha egy `min-h-11` mellé egy `min-h-12`-t adnál, a Tailwindnél nem a class sorrendje dönt, hanem a CSS fájlban elfoglalt helyük. A méret ezért külön paraméter.
- **`motion-safe:`:** csak akkor skáláz, ha a felhasználó nem kért csökkentett mozgást.

## 3.3 `components/Logo.tsx`

```tsx
import Link from "next/link";

export function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="relative block size-8 shrink-0 rounded-[9px] bg-navy"
    >
      <span className="absolute right-[7px] bottom-[7px] h-[13px] w-[7px] rounded-[2px] bg-accent" />
    </span>
  );
}

export function Logo() {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-2.5">
      <LogoMark />
      <span className="font-headline text-[19px] tracking-[-0.03em]">
        laci builds
      </span>
    </Link>
  );
}
```

A jelölő `aria-hidden`, mert dekoráció. A link szövege ("laci builds") elmondja a képernyőolvasónak, hova visz.

## 3.4 `components/Header.tsx`

A tervben mobilon a menü második sorba törik. A CLAUDE.md engedi javítani: a logó és a fő gomb maradjon egy sorban, a linkek alatta legyenek elérhetők. Ezt a flexbox `order` tulajdonságával oldjuk meg, JavaScript nélkül.

```tsx
import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { NavLink } from "@/lib/site";
import { buttonClass } from "@/lib/styles";

type HeaderProps = {
  links: NavLink[];
  cta: NavLink;
};

export function Header({ links, cta }: HeaderProps) {
  return (
    <header className="wrap flex min-h-[72px] flex-wrap items-center justify-between gap-x-4 py-3">
      <Logo />

      {/* Mobilon: utolsó elem, teljes szélesség (új sor). sm-től: középen, jobbra tolva. */}
      <nav
        aria-label="Main"
        className="order-last -ml-3 w-full sm:order-none sm:ml-auto sm:w-auto"
      >
        <ul className="flex gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-full px-3 font-medium hover:bg-ink/5"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link href={cta.href} className={buttonClass("dark")}>
        {cta.label}
      </Link>
    </header>
  );
}
```

### Mit tanulsz ebből?

- **Props típus:** a Header nem tudja, melyik oldalon van. A kezdőlap "Products, Build log, Subscribe" linkeket ad neki, a termékoldal "Products, FAQ, Join the waitlist"-et.
- **`min-h-11` (44px):** a CLAUDE.md minimum érintési méretet kér minden kattintható elemre.
- **`-ml-3`:** a linkeknek van belső paddingje, ezzel a szöveg mobilon a logóval egy vonalba kerül.

## 3.5 `components/Footer.tsx`

```tsx
import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { NavLink } from "@/lib/site";

export function Footer({ links }: { links: NavLink[] }) {
  return (
    <footer className="wrap flex flex-col gap-6 pt-10 pb-12 md:flex-row md:items-center md:justify-between">
      <Logo />

      <ul className="-ml-2 flex flex-wrap gap-x-1 md:ml-0">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
              className={`inline-flex min-h-11 items-center px-2 hover:underline ${
                link.muted ? "text-text-muted" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-[15px] text-text-muted">© 2026 Laci Builds</p>
    </footer>
  );
}
```

`{...(feltétel && {...})}`: ha a feltétel igaz, a props objektum szétterül az elemen, ha hamis, semmi nem történik. Hasznos minta opcionális attribútumokhoz.

## 3.6 Footer linkek a két oldaltípushoz

Add hozzá a `lib/site.ts` végéhez:

```ts
export const homeFooterLinks: NavLink[] = [
  ...socials.map((s) => ({ ...s, external: true })),
  { label: "Developer CV ↗", href: site.cvUrl, external: true, muted: true },
];

export const productFooterLinks: NavLink[] = [
  { label: "All products", href: "/#products" },
  { label: "Build log", href: "/blog" },
  ...socials
    .filter((s) => s.label === "X" || s.label === "GitHub")
    .map((s) => ({ ...s, external: true })),
];
```

A social linkek a terven sima tinta színűek, csak a "Developer CV ↗" halványabb, ezért kapott `muted: true`-t. A `...s` (spread) a social objektum mezőit másolja át, és mellé teszi az `external: true`-t.

## 3.7 Próba

Az `app/page.tsx`-ben tedd a próba `<main>` köré:

```tsx
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { homeFooterLinks } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Header
        links={[
          { label: "Products", href: "/#products" },
          { label: "Build log", href: "/blog" },
        ]}
        cta={{ label: "Subscribe", href: "#subscribe" }}
      />
      <main className="wrap py-12">{/* ...a próba cím... */}</main>
      <Footer links={homeFooterLinks} />
    </>
  );
}
```

## Ellenőrzés

- [ ] desktopon: logó balra, Products, Build log és a fekete "Subscribe" gomb jobbra
- [ ] 390px-en (DevTools, eszköz mód): logó és gomb egy sorban, a linkek alatta
- [ ] Tab billentyűvel lépkedve minden linken látszik a 2px-es fekete fókuszkeret
- [ ] a footerben a "Developer CV ↗" új lapon nyílik
