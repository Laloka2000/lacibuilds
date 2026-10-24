# 9. Termékoldal: `/products/[slug]`

Egyetlen fájl készít oldalt minden termékhez, aminek van `page` adata. Most ez csak a CrawlGuard, de a következő terméknél csak adatot kell felvenned.

## 9.1 `lib/seo.ts`

Minden oldalnak egyedi cím, leírás, canonical URL és Open Graph adat kell. Hogy ne kelljen mindenhol ugyanazt leírni, egy segédfüggvényt írunk:

```ts
import type { Metadata } from "next";
import { site } from "@/lib/site";

type PageMetaInput = {
  title?: string; // ha nincs, a layout alapcíme marad
  description: string;
  path: string; // pl. "/products/crawlguard"
};

export function pageMeta({ title, description, path }: PageMetaInput): Metadata {
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
  };
}
```

Az `openGraph` azért kell minden oldalon teljesen, mert a Next.js nem olvasztja össze a szülő és a gyerek `openGraph` objektumát, hanem a gyerekét használja helyette.

## 9.2 `components/AtAGlance.tsx`

```tsx
type AtAGlanceProps = {
  items: { label: string; value: string }[];
};

export function AtAGlance({ items }: AtAGlanceProps) {
  const visible = items.filter((item) => item.value); // üres érték = nem jelenik meg

  return (
    <aside aria-labelledby="glance-title" className="rounded-[28px] border border-border bg-surface p-8 sm:p-10">
      <h2 id="glance-title" className="font-display text-[23px] font-[750] tracking-[-0.025em] [font-stretch:108%]">
        At a glance
      </h2>
      <dl className="mt-6 space-y-5">
        {visible.map((item) => (
          <div key={item.label}>
            <dt className="font-mono text-[13px] text-text-muted">{item.label}</dt>
            <dd className="mt-1 text-[17px] font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
```

## 9.3 `components/HowItWorks.tsx`

```tsx
import type { ProductPage } from "@/content/products";

type HowItWorksProps = Pick<ProductPage, "stepsTitle" | "stepsIntro" | "steps">;

export function HowItWorks({ stepsTitle, stepsIntro, steps }: HowItWorksProps) {
  return (
    <section aria-labelledby="how-title" className="wrap pb-28">
      <div
        data-surface="dark"
        className="grid gap-10 rounded-[28px] bg-navy px-7 py-12 text-on-navy sm:px-12 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:p-16"
      >
        <div>
          <h2 id="how-title" className="max-w-[6em] font-headline type-h2">
            {stepsTitle}
          </h2>
          <p className="mt-6 max-w-[28rem] text-[18px] leading-[1.6] text-on-navy-muted">{stepsIntro}</p>
        </div>

        <ol className="divide-y divide-navy-line">
          {steps.map((step) => (
            <li key={step.title} className="flex gap-4 py-7 first:pt-0 last:pb-0">
              <span aria-hidden="true" className="mt-2.5 size-3 shrink-0 rounded-[3px] bg-accent" />
              <div>
                <h3 className="font-display text-[26px] leading-[1.15] font-[750] tracking-[-0.025em] [font-stretch:106%]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[17px] leading-[1.6] text-on-navy-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- **`Pick<Típus, "a" | "b">`:** egy meglévő típusból csak a megadott mezőket veszi át. A props így mindig szinkronban marad az adatmodellel.
- **`<ol>`:** a lépések sorrendje számít, ezért számozott lista (a számokat a kis zöld négyzet helyettesíti).
- **`divide-y`:** a gyerekek közé (nem a tetejére, nem az aljára) húz vonalat.

## 9.4 `components/Faq.tsx`

Natív `<details>` elemek, JavaScript nélkül. Az azonos `name="faq"` miatt egyszerre csak egy lehet nyitva (exkluzív accordion, minden modern böngésző támogatja).

```tsx
import { site } from "@/lib/site";

type FaqProps = {
  items: { q: string; a: string }[];
};

export function Faq({ items }: FaqProps) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="wrap scroll-mt-6 pb-28">
      <div className="grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 id="faq-title" className="font-headline type-h2">
            FAQ
          </h2>
          {site.email && (
            <p className="mt-5 max-w-[28rem] text-[18px] leading-[1.6] text-text-muted">
              Something else on your mind? Email me at{" "}
              <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-3">
                {site.email}
              </a>
              .
            </p>
          )}
        </div>

        <div className="border-t border-border-list">
          {items.map((item, index) => (
            <details key={item.q} name="faq" open={index === 0} className="group border-b border-border-list">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-4 py-6 hover:bg-row-hover [&::-webkit-details-marker]:hidden">
                <span className="font-display text-[21px] leading-tight font-[750] tracking-[-0.02em] [font-stretch:106%]">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-ink text-[18px] transition-transform duration-400 ease-brand group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[44rem] px-4 pb-8 text-[17px] leading-[1.65] text-text-strong">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Mit tanulsz ebből?

- **`group-open:rotate-45`:** a `+` 45°-ot fordulva `×` lesz. Az `open:` variáns a `<details open>` állapotra reagál, a `group-` előtag miatt a szülő állapotát figyeli.
- **`list-none` és `[&::-webkit-details-marker]:hidden`:** elrejti a böngésző saját háromszögét (az első a Firefoxnak és Chrome-nak, a második a Safarinak).
- **Miért `<span>` a kérdés, és nem `<h3>`?** A `<summary>` a képernyőolvasónak gomb, és a gomb belsejében a címsor jelentése elveszik. Így tisztább.
- **Az email bekezdés csak kitöltött `site.email` mellett jelenik meg**, így a `[YOUR EMAIL]` sosem kerül ki.

## 9.5 `components/WaitlistBand.tsx`

```tsx
import { SubscribeForm } from "@/components/SubscribeForm";

type WaitlistBandProps = { title: string; text: string };

export function WaitlistBand({ title, text }: WaitlistBandProps) {
  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="wrap scroll-mt-6 pb-[88px]">
      <div className="grid gap-10 rounded-[28px] bg-accent px-7 py-12 text-ink sm:px-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-end lg:p-20">
        <div>
          <h2 id="waitlist-title" className="max-w-[7.5em] font-headline type-band">
            {title}
          </h2>
          <p className="mt-6 max-w-[30rem] text-[18px] leading-[1.6] text-on-accent-muted">{text}</p>
        </div>

        <SubscribeForm
          variant="accent"
          list="waitlist"
          label="Work email"
          buttonLabel="Join the waitlist"
          successMessage="You're on the waitlist. Check your inbox to confirm."
        />
      </div>
    </section>
  );
}
```

## 9.6 `app/products/[slug]/page.tsx`

Hozd létre a mappákat: `app/products/[slug]/`. A szögletes zárójel jelzi a Next.js-nek, hogy ez egy dinamikus szakasz: a `slug` értéke az URL-ből jön.

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtAGlance } from "@/components/AtAGlance";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroReveal } from "@/components/HeroReveal";
import { HowItWorks } from "@/components/HowItWorks";
import { LogoTile } from "@/components/LogoTile";
import { StatusBadge } from "@/components/StatusBadge";
import { SubscribeForm } from "@/components/SubscribeForm";
import { WaitlistBand } from "@/components/WaitlistBand";
import { getProduct, getProductsWithPage } from "@/content/products";
import { pageMeta } from "@/lib/seo";
import { productFooterLinks } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Csak a felsorolt slugok léteznek, minden más 404
export const dynamicParams = false;

export function generateStaticParams() {
  return getProductsWithPage().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product?.page) return {};

  return pageMeta({
    title: product.name,
    description: product.page.intro,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  const page = product?.page;
  if (!product || !page) notFound();

  return (
    <>
      <Header
        links={[
          { label: "Products", href: "/#products" },
          { label: "FAQ", href: "#faq" },
        ]}
        cta={{ label: "Join the waitlist", href: "#waitlist" }}
      />

      <main>
        <HeroReveal className="wrap pt-6 pb-[88px]">
          <Link
            data-hero-item="0"
            href="/#products"
            className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 font-mono text-[14px] text-text-muted hover:text-ink"
          >
            ← All products
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div>
              <div data-hero-item="0" className="flex items-center gap-4">
                <LogoTile logo={product.logo} size="lg" />
                <div className="flex flex-col items-start gap-1.5">
                  <StatusBadge
                    status={product.status}
                    label={product.status === "waitlist" ? "Waitlist open" : undefined}
                  />
                  <p className="text-[15px] text-text-muted">by Laci Builds</p>
                </div>
              </div>

              <h1 data-hero-item="1" className="mt-6 font-headline type-h1-product">
                {page.headline}
              </h1>

              <p data-hero-item="2" className="mt-6 max-w-[36rem] text-[20px] leading-[1.55] text-text-strong">
                {page.intro}
              </p>

              {page.waitlist && (
                <div data-hero-item="3" className="mt-10 max-w-[520px]">
                  <SubscribeForm
                    list="waitlist"
                    label="Work email"
                    buttonLabel="Join the waitlist"
                    buttonTone="accent"
                    successMessage="You're on the waitlist. Check your inbox to confirm."
                  />
                </div>
              )}
            </div>

            <div data-hero-item="3">
              <AtAGlance items={page.glance} />
            </div>
          </div>
        </HeroReveal>

        <HowItWorks stepsTitle={page.stepsTitle} stepsIntro={page.stepsIntro} steps={page.steps} />
        <Faq items={page.faq} />
        {page.waitlist && <WaitlistBand title={page.bandTitle} text={page.bandText} />}
      </main>

      <Footer links={productFooterLinks} />
    </>
  );
}
```

### Mit tanulsz ebből?

- **`params` egy Promise:** a Next.js 15 óta a dinamikus paramétereket `await`-tel kell kiolvasni. Ezért `async` a komponens.
- **`generateStaticParams`:** build közben megmondja, milyen slugokra kell előre HTML-t generálni. Az oldal így teljesen statikus, villámgyors.
- **`dynamicParams = false`:** a listán kívüli slug (`/products/valami`) automatikusan 404.
- **`notFound()`:** megszakítja a renderelést és a 404 oldalt mutatja. A TypeScript tudja, hogy utána már nem fut tovább a kód, ezért a `product` és a `page` biztosan létezik.
- **`generateMetadata`:** ugyanaz, mint a `metadata` export, csak függvény, mert a cím a termék adataitól függ.
- **Ha a waitlist lezárul,** a `waitlist: false` eltünteti a hero űrlapot és a zöld sávot is. A fejléc gombját ilyenkor érdemes lenne átírni, ez egy jó későbbi feladat.

## Ellenőrzés

Nyisd meg: http://localhost:3000/products/crawlguard, és hasonlítsd a `design/product-crawlguard-*.png` képekhez.

- [ ] a hero elemek beúsznak, jobbra az "At a glance" doboz (a "Price" sor nem látszik, amíg üres)
- [ ] a navy "How it will work" panel, három lépéssel, a lépések között vonallal
- [ ] FAQ: az első kérdés nyitva, egy másikra kattintva az előző bezárul, a `+` elfordulva `×` lesz
- [ ] a zöld sávban a sötét input és a körvonalas gomb
- [ ] a fejléc "FAQ" linkje és a "Join the waitlist" gombja a megfelelő szekcióhoz görget
- [ ] http://localhost:3000/products/valami 404-et ad
- [ ] a kezdőlapon mindhárom CrawlGuard kártya erre az oldalra visz
