# 7. A kezdőlap összerakása

Most jön a tervben látható négy szekció: **Hero**, **könyvtár**, **build log**, **SubscribeBand**.

Térközök a CLAUDE.md-ből (desktop):

| Szekció | Felül | Alul |
|---|---|---|
| Hero | 48px (`pt-12`) | 88px (`pb-[88px]`) |
| Könyvtár | 48px (`pt-12`) | 112px (`pb-28`) |
| Build log | | 112px (`pb-28`) |
| Subscribe sáv | | 88px (`pb-[88px]`) |
| Footer | | 48px (`pb-12`) |

## 7.1 `components/Avatar.tsx`

Amíg nincs fotó, egy semleges kör jelenik meg.

```tsx
import Image from "next/image";
import { site } from "@/lib/site";

type AvatarProps = { size: number; ring: "ring-2" | "ring-3" };

export function Avatar({ size, ring }: AvatarProps) {
  const className = `shrink-0 rounded-full ${ring} ring-accent`;

  if (!site.avatar) {
    return (
      <span
        aria-hidden="true"
        className={`block bg-[#D5DCE5] ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // alt="": a név ott van mellette, a kép dekoráció
  return (
    <Image src={site.avatar} alt="" width={size} height={size} className={`object-cover ${className}`} />
  );
}
```

Ha megvan a fotó: tedd a `public/laci.jpg` helyre (legalább 112×112 px, négyzetes), és a `lib/site.ts`-ben írd: `avatar: "/laci.jpg"`. A `next/image` automatikusan kisebb, modern formátumú (WebP/AVIF) változatot készít belőle.

## 7.2 `components/BrandCard.tsx`

Két egymásra tett kártya: hátul a zöld (4°), elöl a navy (-3°). Hoverre az első kiegyenesedik és felemelkedik, a hátsó tovább dől és jobbra csúszik.

```tsx
import { Avatar } from "@/components/Avatar";
import { site, socials } from "@/lib/site";

const facts = [
  { label: "Now building", value: "CrawlGuard" },
  { label: "Built for", value: "Developers and agencies" },
  { label: "Rule", value: "One product at a time" },
  { label: "Revenue", value: "$0/mo, for now" }, // TODO: döntsd el, marad-e
];

export function BrandCard() {
  return (
    <div className="group relative mx-auto w-full max-w-[420px] lg:mx-0">
      {/* Hátsó zöld kártya */}
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-4 translate-y-5 rotate-4 rounded-[28px] bg-accent transition-transform duration-700 ease-brand motion-safe:group-hover:translate-x-7 motion-safe:group-hover:rotate-8"
      />

      {/* Első navy kártya */}
      <div
        data-surface="dark"
        className="relative -rotate-3 rounded-[28px] bg-navy p-8 text-on-navy shadow-brand transition-transform duration-700 ease-brand sm:p-10 motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:rotate-0"
      >
        <div className="flex items-center justify-between gap-4 font-mono text-[13px]">
          <span className="text-on-navy-muted">Laci Builds</span>
          <span className="text-accent">building in public</span>
        </div>

        <p className="mt-7 font-headline text-[34px] leading-none tracking-[-0.03em] text-accent">
          A one-person product studio.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-[12px] text-on-navy-label">{fact.label}</dt>
              <dd className="mt-1.5 text-[17px] leading-snug font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 border-t border-navy-line pt-6">
          <div className="flex items-center gap-3">
            <Avatar size={36} ring="ring-2" />
            <span className="font-semibold">{site.handle}</span>
          </div>
          {socials.length > 0 && (
            <ul className="mt-3 -ml-2 flex flex-wrap">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center px-2 text-[15px] text-on-navy-link hover:text-on-navy hover:underline"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Mit tanulsz ebből?

- **`rotate-4`, `-rotate-3`, `translate-x-4`:** a Tailwind v4 ezeket külön CSS tulajdonságként (`rotate`, `translate`) állítja, ezért egymással kombinálhatók és együtt animálhatók.
- **`absolute inset-0`:** a hátsó kártya pontosan akkora, mint a szülő, amit az első kártya tölt ki.
- **`motion-safe:group-hover:`:** variánsok egymás után fűzhetők. Csak akkor hat, ha nincs reduced motion **és** a csoport fölött van az egér.
- **`<dl>`, `<dt>`, `<dd>`:** a "címke: érték" párok szemantikus HTML eleme.
- **`data-surface="dark"`:** a 2. fejezet CSS-e ettől ad zöld fókuszkeretet a sötét kártyán.

## 7.3 `components/HeroReveal.tsx` (ideiglenes)

A GSAP animációt a 8. fejezetben írjuk meg. Addig egy sima változat kell, hogy a kód lefusson:

```tsx
export function HeroReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
```

> A `data-hero-item` elemek a 2. fejezet CSS-e miatt addig **láthatatlanok**, amíg a GSAP meg nem jeleníti őket. Ha most semmit nem látsz a hero bal oldalán, az a várt működés. Ideiglenesen DevToolsban kapcsold be a reduced motion emulációt (Rendering fül > Emulate CSS media feature prefers-reduced-motion > reduce), és megjelennek.

## 7.4 `components/Hero.tsx`

```tsx
import { Avatar } from "@/components/Avatar";
import { BrandCard } from "@/components/BrandCard";
import { HeroReveal } from "@/components/HeroReveal";
import { SubscribeForm } from "@/components/SubscribeForm";

export function Hero() {
  return (
    // overflow-x-clip: mobilon a megdöntött kártya ne okozzon vízszintes görgetést
    <section className="overflow-x-clip">
      <HeroReveal className="wrap grid items-center gap-16 pt-12 pb-[88px] lg:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <div data-hero-item="0" className="flex items-center gap-4">
            <Avatar size={56} ring="ring-3" />
            <div>
              <p className="text-[17px] font-semibold">Laci Lelovics</p>
              <p className="text-[15px] text-text-muted">Full-stack developer, Hungary</p>
            </div>
          </div>

          <h1 data-hero-item="1" className="mt-8 font-headline type-h1">
            Small SaaS tools, built <span className="highlight">in public.</span>
          </h1>

          <p data-hero-item="2" className="mt-7 max-w-[34rem] text-[20px] leading-[1.55] text-text-strong">
            Laci Builds is my one-person product studio. Every product fixes a problem I&apos;ve
            hit myself as a developer.
          </p>

          <div data-hero-item="3" className="mt-10 max-w-[520px]">
            <SubscribeForm
              list="newsletter"
              label="Get the build log, every other week"
              buttonLabel="Subscribe"
              successMessage="Thanks, you're subscribed. Check your inbox to confirm."
            />
          </div>
        </div>

        <div data-hero-item="3">
          <BrandCard />
        </div>
      </HeroReveal>
    </section>
  );
}
```

- **`data-hero-item="0..3"`:** a 8. fejezetben a GSAP ebből a számból tudja, mennyi késleltetést kapjon az elem (0.06s, 0.14s, 0.22s, 0.32s).
- **`&apos;`:** a JSX szövegben a sima `'` miatt az ESLint figyelmeztet. Az `&apos;` ugyanazt az aposztrófot jeleníti meg.
- **Miért a `<section>`-ön van az `overflow-x-clip`, és nem a `wrap`-on?** A `wrap` max 1200px széles. Ha azon lenne, desktopon is levágná a hoverre kicsúszó zöld kártyát. A teljes szélességű `<section>` csak a képernyő szélén vág.

## 7.5 `components/SubscribeBand.tsx`

```tsx
import { SubscribeForm } from "@/components/SubscribeForm";

export function SubscribeBand() {
  return (
    <section id="subscribe" aria-labelledby="subscribe-title" className="wrap scroll-mt-6 pb-[88px]">
      <div
        data-surface="dark"
        className="grid gap-10 rounded-[28px] bg-navy px-7 py-12 text-on-navy sm:px-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-end lg:p-20"
      >
        <div>
          <h2 id="subscribe-title" className="max-w-[7.5em] font-headline type-band">
            Follow the <span className="text-accent">build.</span>
          </h2>
          <p className="mt-6 max-w-[30rem] text-[18px] leading-[1.6] text-on-navy-muted">
            One email every other week: what I shipped, what broke, what I learned and what&apos;s
            next.
          </p>
        </div>

        <SubscribeForm
          variant="navy"
          list="newsletter"
          label="Email address"
          buttonLabel="Subscribe"
          successMessage="Thanks, you're subscribed. Check your inbox to confirm."
        />
      </div>
    </section>
  );
}
```

- **`max-w-[7.5em]`:** az `em` a cím saját betűméretéhez igazodik, ezért minden képernyőméreten a "build." kerül új sorba, ahogy a terven.
- **`scroll-mt-6`:** amikor a fejléc "Subscribe" gombja ide görget (`#subscribe`), marad egy kis hely a szekció fölött.

## 7.6 `app/page.tsx`

Most már a végleges kezdőlap. Cseréld le az egészet:

```tsx
import Link from "next/link";
import { BuildLogRow } from "@/components/BuildLogRow";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { SubscribeBand } from "@/components/SubscribeBand";
import { getProducts } from "@/content/products";
import { getPosts } from "@/lib/posts";
import { homeFooterLinks } from "@/lib/site";

export default function HomePage() {
  const products = getProducts();
  const posts = getPosts().slice(0, 3);

  return (
    <>
      <Header
        links={[
          { label: "Products", href: "/#products" },
          { label: "Build log", href: "/blog" },
        ]}
        cta={{ label: "Subscribe", href: "#subscribe" }}
      />

      <main>
        <Hero />

        <section id="products" aria-labelledby="products-title" className="wrap scroll-mt-6 pt-12 pb-28">
          <h2 id="products-title" className="max-w-[10em] font-headline type-h2">
            The micro-SaaS library
          </h2>
          <p className="mt-4 text-[18px] leading-[1.55] text-text-muted">
            Everything I&apos;ve launched, am building or have let go.
          </p>

          <ul className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
            {products.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>

        {posts.length > 0 && (
          <section id="build-log" aria-labelledby="build-log-title" className="wrap pb-28">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 id="build-log-title" className="font-headline type-h2">
                  Build log
                </h2>
                <p className="mt-4 text-[18px] leading-[1.55] text-text-muted">
                  The decisions, mistakes and numbers behind every product.
                </p>
              </div>
              <Link href="/blog" className="group inline-flex min-h-11 items-center gap-1.5 font-semibold">
                All posts
                <span className="transition-transform duration-300 ease-brand motion-safe:group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <ul className="mt-12 border-t border-border-list">
              {posts.map((post) => (
                <BuildLogRow key={post.slug} post={post} />
              ))}
            </ul>
          </section>
        )}

        <SubscribeBand />
      </main>

      <Footer links={homeFooterLinks} />
    </>
  );
}
```

### Mit tanulsz ebből?

- **A page egy server komponens:** a `getProducts()` és `getPosts()` itt, a szerveren (build közben) fut. A böngésző csak a kész HTML-t kapja meg.
- **`posts.length > 0 &&`:** élesben, amíg minden poszt vázlat, a build log szekció egyszerűen nem jelenik meg, így nem kerül ki placeholder. Fejlesztés közben látszik, mert ott a vázlatokat is mutatjuk.
- **`aria-labelledby`:** a szekció a címéből kap nevet, így a képernyőolvasók "régióként" tudnak közöttük ugrálni.

## Ellenőrzés

Hasonlítsd össze a `design/home-desktop-full.png` és a `design/home-mobile.png` képpel.

- [ ] 1440px-en a hero bal oldalán a név sor, a cím (két sorban), a szöveg és az űrlap, jobbra a megdöntött kártya
- [ ] a BrandCard hoverre kiegyenesedik, a zöld kártya jobbra dől
- [ ] a könyvtár rácsban a 3 CrawlGuard kártya
- [ ] a build log 3 sora a vázlatokkal ("Draft" dátummal)
- [ ] a "Follow the build." sávban a "build." zöld és külön sorban van
- [ ] a fejléc "Subscribe" gombja a sávhoz görget
- [ ] 360px szélességnél sincs vízszintes görgetősáv
