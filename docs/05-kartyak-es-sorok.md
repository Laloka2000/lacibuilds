# 5. Kártyák és sorok

Négy kis komponens, amiket a kezdőlap és a termékoldal is használ.

## 5.1 `components/StatusBadge.tsx`

```tsx
import type { ProductStatus } from "@/content/products";

const styles: Record<ProductStatus, { label: string; className: string }> = {
  waitlist: { label: "Waitlist", className: "bg-ink text-accent" },
  planned: { label: "Planned", className: "bg-[#E2E8F0] text-[#334155]" },
  live: { label: "Live", className: "bg-[#DCFCE7] text-[#166534]" },
  beta: { label: "Beta", className: "bg-[#DBEAFE] text-[#1E40AF]" },
  building: { label: "Building", className: "bg-[#FEF3C7] text-[#92400E]" },
  idea: { label: "Idea", className: "text-[#334155] ring-1 ring-[#94A3B8] ring-inset" },
  archived: { label: "Archived", className: "bg-[#E2E8F0] text-[#475569]" },
};

type StatusBadgeProps = {
  status: ProductStatus;
  label?: string; // felülírja az alap feliratot, pl. "Waitlist open"
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = styles[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-[11px] py-1.5 font-mono text-[13px] leading-none font-medium ${style.className}`}
    >
      {label ?? style.label}
    </span>
  );
}
```

### Mit tanulsz ebből?

- **`Record<ProductStatus, ...>`:** ha a 7 státuszból egy is hiányzik az objektumból, a TypeScript hibát jelez.
- **`ring-inset` a border helyett az "Idea"-nál:** a `border` 1px-szel megnövelné a pill méretét, a belső `ring` (box-shadow) nem. Így minden pill pontosan egyforma magas.
- **Tetszőleges értékek `[...]`-ben:** a státusz színek csak itt kellenek, ezért nem kerültek a `@theme`-be. Ami csak egy helyen él, maradhat helyben.

## 5.2 `components/LogoTile.tsx`

```tsx
import type { Product } from "@/content/products";

type LogoTileProps = {
  logo: Product["logo"];
  size?: "md" | "lg";
};

export function LogoTile({ logo, size = "md" }: LogoTileProps) {
  const sizeClass =
    size === "lg"
      ? "size-[72px] rounded-[20px] text-[40px]"
      : "size-[52px] rounded-[15px] text-[28px]";

  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center font-display leading-none font-black text-accent [font-stretch:112%] ${sizeClass}`}
      style={{ backgroundColor: logo.color }}
    >
      {logo.letter}
    </span>
  );
}
```

- **`Product["logo"]`:** egy típus egy mezőjének a típusát veszi ki. Ha a `logo` szerkezete változik, ez is követi.
- **`style` a háttérhez:** a szín adatból jön, futásidőben. A Tailwind csak olyan class-t tud legenerálni, amit a forráskódban teljes egészében lát, ezért a `bg-[${color}]` **nem működne**. Dinamikus értékre `style` kell.
- **`[font-stretch:112%]`:** tetszőleges CSS tulajdonság Tailwind class-ként.

## 5.3 `components/ProductCard.tsx`

A kártya csak akkor link és csak akkor kap hover effektet, ha van `href`.

A CLAUDE.md szerint csak `transform`-ot és `opacity`-t animálunk. Az árnyékot ezért egy `::after` rétegre tesszük, és annak az átlátszóságát animáljuk. Ez sokkal olcsóbb, mint a `box-shadow` animálása.

```tsx
import Link from "next/link";
import { LogoTile } from "@/components/LogoTile";
import { StatusBadge } from "@/components/StatusBadge";
import type { Product } from "@/content/products";

export function ProductCard({ product }: { product: Product }) {
  const isArchived = product.status === "archived";

  const base =
    "relative flex h-full flex-col rounded-[20px] border p-[26px]";
  const look = isArchived
    ? "border-dashed border-[#B8C2CF] bg-surface-muted"
    : "border-border bg-surface";
  const hover = [
    "group transition-transform duration-450 ease-brand hover:border-ink motion-safe:hover:-translate-y-1.5",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-card",
    "after:opacity-0 after:transition-opacity after:duration-450 after:ease-brand hover:after:opacity-100",
  ].join(" ");

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <LogoTile logo={product.logo} />
        <StatusBadge status={product.status} />
      </div>

      <h3 className="mt-6 font-display text-[23px] leading-tight font-[750] tracking-[-0.025em] [font-stretch:108%]">
        {product.name}
      </h3>
      <p className="mt-2 text-[15.5px] leading-[1.55] text-text-muted">
        {product.tagline}
      </p>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-4 border-t border-border-inner pt-4 font-mono text-[13px]">
          <span className="text-text-muted">{product.platform}</span>
          {product.href ? (
            <span className="font-medium">
              View{" "}
              <span className="inline-block transition-transform duration-450 ease-brand motion-safe:group-hover:translate-x-[5px]">
                →
              </span>
            </span>
          ) : (
            product.metric && <span className="font-medium">{product.metric}</span>
          )}
        </div>
      </div>
    </>
  );

  if (product.href) {
    return (
      <Link href={product.href} className={`${base} ${look} ${hover}`}>
        {content}
      </Link>
    );
  }

  return <div className={`${base} ${look}`}>{content}</div>;
}
```

### Mit tanulsz ebből?

- **`group` és `group-hover:`:** a szülőn lévő hover állapotra reagál egy gyerek elem (a nyíl). Az egész kártya fölé viszed az egeret, a nyíl mégis mozdul.
- **`after:` variáns:** a Tailwind a `::after` pszeudo-elemet is tudja stílusozni. Az `after:` class-ok automatikusan kapnak `content: ""`-t.
- **`mt-auto` flex oszlopban:** a kártya alja mindig a kártya aljára kerül, akkor is, ha a tagline rövidebb. Így a soron belül a vonalak egy magasságban vannak.
- **`h-full`:** a rácsban egy sor kártyái egyforma magasak lesznek.
- **`duration-450`:** a Tailwind v4-ben bármilyen szám írható a `duration-` után (ms).
- **A border nem animálódik:** azonnal vált tintára, a mozgás csak a `transform`. A szemnek ez nem tűnik fel, a böngészőnek viszont könnyebb.

## 5.4 `components/BuildLogRow.tsx`

```tsx
import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";

export function BuildLogRow({ post }: { post: Post }) {
  return (
    <li className="border-b border-border-list">
      <Link
        href={`/blog/${post.slug}`}
        className="group grid gap-x-8 gap-y-3 px-4 py-7 hover:bg-row-hover md:grid-cols-[8.5rem_minmax(0,1fr)_auto] md:items-center"
      >
        <time dateTime={post.date || undefined} className="font-mono text-[14px] text-text-muted">
          {formatDate(post.date)}
        </time>

        <div>
          <h3 className="font-display text-[clamp(22px,2.2vw,28px)] leading-[1.1] font-[750] tracking-[-0.025em] [font-stretch:106%]">
            {post.title}
          </h3>
          <p className="mt-2 text-[17px] leading-[1.55] text-text-muted">{post.excerpt}</p>
        </div>

        <div className="flex items-center gap-5">
          <span className="rounded-full border border-ink px-3.5 py-1.5 font-mono text-[13px]">
            {post.tag}
          </span>
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-on-navy"
          >
            <span className="transition-transform duration-300 ease-brand motion-safe:group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}
```

### Mit tanulsz ebből?

- **`grid-cols-[8.5rem_minmax(0,1fr)_auto]`:** dátum oszlop fix szélességgel, a cím kitölti a helyet, a tag és nyíl annyi helyet kap, amennyi kell. A `minmax(0,1fr)` megakadályozza, hogy egy hosszú szó kitolja a rácsot.
- **`_` a szóköz helyett:** a Tailwind class-okban nem lehet szóköz, ezért a `[...]`-ben aláhúzást írsz.
- **Mobilon nincs `grid-cols`:** egy oszlop lesz, az elemek egymás alá kerülnek, ahogy a mobil terven.
- **A sor egésze egy link:** nagyobb kattintási felület, és a képernyőolvasó egyben olvassa fel.

## Ellenőrzés

Próbaként az `app/page.tsx`-ben:

```tsx
<ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
  {getProducts().map((product) => (
    <li key={product.slug}>
      <ProductCard product={product} />
    </li>
  ))}
</ul>
```

- [ ] desktopon 3 kártya egy sorban, tabletnél 2, mobilon 1
- [ ] hoverre a kártya 6px-t emelkedik, árnyékot kap, a keret fekete lesz, a nyíl jobbra csúszik
- [ ] a próba kedvéért írd át egy termék státuszát `"idea"`-ra és `"archived"`-ra, és nézd meg a stílust. Utána állítsd vissza.
- [ ] Windowsban kapcsold be: Beállítások > Kisegítő lehetőségek > Vizuális effektusok > Animációs effektusok: **ki**. Hoverre most nem mozdulhat semmi. Utána kapcsold vissza.
