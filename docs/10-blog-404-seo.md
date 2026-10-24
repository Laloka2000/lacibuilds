# 10. Blog, 404 és SEO

Ezek az oldalak nincsenek megtervezve. A CLAUDE.md szerint ugyanabban a rendszerben kell maradniuk, a meglévő komponensekből építkezünk.

## 10.1 `app/blog/page.tsx`: a teljes lista

```tsx
import { BuildLogRow } from "@/components/BuildLogRow";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SubscribeBand } from "@/components/SubscribeBand";
import { getPosts } from "@/lib/posts";
import { pageMeta } from "@/lib/seo";
import { homeFooterLinks } from "@/lib/site";

export const metadata = pageMeta({
  title: "Build log",
  description: "The decisions, mistakes and numbers behind every product Laci Builds makes.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getPosts();

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
        <section className="wrap pt-12 pb-28">
          <h1 className="font-headline type-h1">Build log</h1>
          <p className="mt-5 max-w-[36rem] text-[20px] leading-[1.55] text-text-strong">
            The decisions, mistakes and numbers behind every product.
          </p>

          {posts.length > 0 ? (
            <ul className="mt-12 border-t border-border-list">
              {posts.map((post) => (
                <BuildLogRow key={post.slug} post={post} />
              ))}
            </ul>
          ) : (
            <p className="mt-12 border-t border-border-list pt-8 text-[18px] text-text-muted">
              The first post is on its way.
            </p>
          )}
        </section>

        <SubscribeBand />
      </main>

      <Footer links={homeFooterLinks} />
    </>
  );
}
```

> "The first post is on its way." saját javaslat, a CLAUDE.md-ben nincs ilyen szöveg. Írd át, ha mást szeretnél.

## 10.2 Stílus a Markdown tartalomhoz

A `marked` sima HTML-t ad (`<h2>`, `<p>`, `<ul>`...), amin nincsenek Tailwind class-ok. Ezért egy hagyományos CSS osztályt írunk, ami a gyerek elemeket stílusozza. Add a `globals.css` végéhez:

```css
@layer components {
  .post-body {
    font-size: 18px;
    line-height: 1.75;
    color: var(--color-text-strong);
  }

  .post-body > * + * {
    margin-top: 1.25em;
  }

  .post-body h2,
  .post-body h3 {
    margin-top: 2em;
    font-family: var(--font-archivo);
    font-weight: 750;
    font-stretch: 106%;
    line-height: 1.15;
    letter-spacing: -0.025em;
    color: var(--color-ink);
  }

  .post-body h2 { font-size: 30px; }
  .post-body h3 { font-size: 23px; }

  .post-body a {
    color: var(--color-ink);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .post-body strong { font-weight: 600; color: var(--color-ink); }
  .post-body ul { list-style: disc; padding-left: 1.25em; }
  .post-body ol { list-style: decimal; padding-left: 1.25em; }
  .post-body li + li { margin-top: 0.4em; }

  .post-body blockquote {
    border-left: 3px solid var(--color-accent);
    padding-left: 1em;
    color: var(--color-ink);
  }

  .post-body code {
    font-family: var(--font-dm-mono);
    font-size: 0.9em;
    background: var(--color-border-inner);
    padding: 0.1em 0.35em;
    border-radius: 6px;
  }

  .post-body pre {
    overflow-x: auto;
    padding: 20px;
    border-radius: 16px;
    background: var(--color-navy);
    color: var(--color-on-navy);
    font-size: 15px;
    line-height: 1.6;
  }

  .post-body pre code { background: none; padding: 0; }
}
```

A `> * + *` (a "bagoly szelektor") minden elem közé tesz térközt, kivéve az első elé.

## 10.3 `app/blog/[slug]/page.tsx`: egy poszt

A CLAUDE.md szerint: kb. 720px-es olvasó oszlop, Archivo címek, Onest 18px / 1.75 szöveg, a végén a feliratkozó sáv.

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SubscribeBand } from "@/components/SubscribeBand";
import { formatDate, getPost, getPosts } from "@/lib/posts";
import { pageMeta } from "@/lib/seo";
import { homeFooterLinks } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return pageMeta({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

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
        <article className="mx-auto max-w-[768px] px-6 pt-6 pb-28">
          <Link
            href="/blog"
            className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 font-mono text-[14px] text-text-muted hover:text-ink"
          >
            ← Build log
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[14px] text-text-muted">
            <time dateTime={post.date || undefined}>{formatDate(post.date)}</time>
            <span className="rounded-full border border-ink px-3 py-1 text-[13px] text-ink">{post.tag}</span>
          </div>

          <h1 className="mt-5 font-headline type-h2">{post.title}</h1>
          <p className="mt-5 text-[20px] leading-[1.55] text-text-muted">{post.excerpt}</p>

          <div className="post-body mt-12" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>

        <SubscribeBand />
      </main>

      <Footer links={homeFooterLinks} />
    </>
  );
}
```

- **`max-w-[768px] px-6`:** 768 mínusz 2×24 px padding = 720px tartalom.
- **`dangerouslySetInnerHTML`:** kész HTML-t illeszt be. A neve figyelmeztetés: idegen, ellenőrizetlen tartalommal XSS támadás lehetne belőle. Itt a saját Markdown fájljaidból jön, ezért rendben van.

## 10.4 `app/not-found.tsx`: 404

```tsx
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { homeFooterLinks } from "@/lib/site";
import { buttonClass } from "@/lib/styles";

export default function NotFound() {
  return (
    <>
      <Header
        links={[
          { label: "Products", href: "/#products" },
          { label: "Build log", href: "/blog" },
        ]}
        cta={{ label: "Subscribe", href: "/#subscribe" }}
      />

      <main className="wrap pt-20 pb-28">
        <p className="font-mono text-[14px] text-text-muted">404</p>
        <h1 className="mt-4 max-w-[12em] font-headline type-h1">
          This page <span className="highlight">doesn&apos;t exist.</span>
        </h1>
        <p className="mt-6 max-w-[34rem] text-[20px] leading-[1.55] text-text-strong">
          It may have moved, or it was never built.
        </p>
        <Link href="/" className={`mt-10 ${buttonClass("dark", "md")}`}>
          Back to home
        </Link>
      </main>

      <Footer links={homeFooterLinks} />
    </>
  );
}
```

> A 404 szövegei saját javaslatok. Írd át nyugodtan.

A 404 oldalra a Next.js automatikusan `noindex`-et tesz, ezt nem kell kézzel.

## 10.5 A kezdőlap metaadatai

Az `app/page.tsx`-ben a komponens fölé:

```tsx
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ description: site.description, path: "/" });
```

A `title` itt szándékosan hiányzik, így a layout alapcíme ("Laci Builds: small SaaS tools, built in public") marad.

## 10.6 `app/sitemap.ts`

```ts
import type { MetadataRoute } from "next";
import { getProductsWithPage } from "@/content/products";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getProductsWithPage().map((product) => ({
    url: `${site.url}/products/${product.slug}`,
  }));

  const posts = getPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    ...(post.date && { lastModified: post.date }),
  }));

  return [{ url: site.url }, { url: `${site.url}/blog` }, ...products, ...posts];
}
```

## 10.7 `app/robots.ts`

```ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
```

A Vercel a preview deploymentekre (minden nem production URL-re) magától `noindex` fejlécet tesz, így a tesztverziók nem kerülnek be a Google-be.

## 10.8 Favicon

A create-next-app hozott egy `app/favicon.ico`-t (Next.js logó). Cseréld le a saját logódra: a legegyszerűbb egy `app/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="9" fill="#0B1630"/>
  <rect x="18" y="12" width="7" height="13" rx="2" fill="#4ADE80"/>
</svg>
```

és töröld az `app/favicon.ico`-t. A Next.js az `icon.svg`-t automatikusan beköti.

## Ellenőrzés

- [ ] http://localhost:3000/blog: a három vázlat a közös sor komponenssel
- [ ] egy sorra kattintva megnyílik a poszt, 720px-es oszlopban, a végén a navy sáv
- [ ] http://localhost:3000/nincs-ilyen: a 404 oldal a saját fejléccel és lábléccel
- [ ] http://localhost:3000/sitemap.xml és http://localhost:3000/robots.txt betöltenek
- [ ] DevTools > Elements > `<head>`: minden oldalon más a `<title>`, a `description` és a `<link rel="canonical">`
- [ ] `npm run build` hiba nélkül lefut. A kimenetben az oldalak mellett `○` (Static) vagy `●` (SSG) jel áll, vagyis előre generáltak.
