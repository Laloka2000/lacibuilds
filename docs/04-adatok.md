# 4. Adatok: termékek és posztok

A kártyák, a termékoldalak és a build log sorok **adatból** renderelődnek. A komponens nem tudja, hogy épp a CrawlGuardot mutatja: kap egy objektumot, és kirajzolja. Így egy új termékhez csak egy új objektumot kell felvenned.

## 4.1 `content/products.ts`

```ts
export type ProductStatus =
  | "live"
  | "beta"
  | "building"
  | "waitlist"
  | "planned"
  | "idea"
  | "archived";

export type ProductPage = {
  headline: string; // h1
  intro: string; // hosszabb leírás a h1 alatt, ez a meta description is
  glance: { label: string; value: string }[];
  stepsTitle: string;
  stepsIntro: string;
  steps: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  waitlist: boolean;
  bandTitle: string;
  bandText: string;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  status: ProductStatus;
  platform: string;
  metric?: string;
  logo: { letter?: string; color: string };
  order: number;
  href?: string; // ha van, a kártya link
  page?: ProductPage; // ha van, saját oldalt kap: /products/[slug]
};

const products: Product[] = [
  {
    slug: "crawlguard",
    name: "CrawlGuard",
    tagline: "Catch technical SEO regressions in pull requests, before they ship.",
    status: "waitlist",
    platform: "GitHub Action",
    logo: { letter: "C", color: "#0B1630" },
    order: 1,
    href: "/products/crawlguard",
    page: {
      headline: "CrawlGuard",
      intro:
        "Catch technical SEO regressions in your pull requests, before they reach production.",
      glance: [
        { label: "Built for", value: "Dev teams and agencies" },
        { label: "Ships first as", value: "GitHub Action" },
        { label: "Coming later", value: "WordPress plugin, Chrome extension" },
        { label: "Price", value: "" }, // TODO: ár. Üresen nem jelenik meg.
        { label: "Status", value: "Building starts with sign-ups" },
      ],
      stepsTitle: "How it will work",
      stepsIntro: "The planned flow. The details get shaped together with the waitlist.",
      steps: [
        {
          title: "Add it to your workflow",
          text: "Drop the CrawlGuard Action into your repository, next to your other checks.",
        },
        {
          title: "Open a pull request",
          text: "CrawlGuard checks the changes for technical SEO breakage.",
        },
        {
          title: "Fix it before merge",
          text: "Problems show up on the PR, so they never reach production.",
        },
      ],
      faq: [
        {
          q: "What does CrawlGuard check?",
          a: "Technical SEO basics that tend to break quietly during a deploy, like an accidental noindex, a missing canonical tag or a changed robots.txt. The full list is being shaped with the people on the waitlist.",
        },
        {
          q: "Is it available yet?",
          a: "Not yet. CrawlGuard is waitlist-first: I start building once enough people sign up, and the waitlist gets access first.",
        },
        {
          q: "Who is it for?",
          a: "Dev teams and agencies that ship website changes through GitHub pull requests, and don't want SEO problems to reach production.",
        },
        {
          q: "How much will it cost?",
          a: "Pricing isn't decided yet. People on the waitlist hear it first, and their feedback helps set it.",
        },
        {
          q: "Will there be a WordPress version?",
          a: "Yes. After the GitHub Action, a free WordPress plugin and a Chrome extension are planned.",
        },
        {
          q: "Who's building it?",
          a: "Me, Laci Lelovics, a full-stack developer from Hungary. I'm building CrawlGuard in public, and every step goes into the build log.",
        },
      ],
      waitlist: true,
      bandTitle: "Get in before launch.",
      bandText: "Join the waitlist and help decide what CrawlGuard checks first.",
    },
  },
  {
    slug: "crawlguard-wordpress",
    name: "CrawlGuard for WordPress",
    tagline: "The same checks as a free plugin, for WordPress site owners.",
    status: "planned",
    platform: "WordPress plugin",
    logo: { letter: "C", color: "#0B1630" },
    order: 2,
    href: "/products/crawlguard",
  },
  {
    slug: "crawlguard-chrome",
    name: "CrawlGuard for Chrome",
    tagline: "CrawlGuard checks on any page you open, as a browser extension.",
    status: "planned",
    platform: "Chrome extension",
    logo: { letter: "C", color: "#0B1630" },
    order: 3,
    href: "/products/crawlguard",
  },
];

export function getProducts() {
  return [...products].sort((a, b) => a.order - b.order);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsWithPage() {
  return getProducts().filter((p) => p.page);
}
```

### Mit tanulsz ebből?

- **Union típus a státuszra:** ha elgépeled (`"waitlsit"`), a TypeScript azonnal szól. A 5. fejezetben a StatusBadge egy `Record<ProductStatus, ...>` objektumot használ, így ha új státuszt adsz hozzá, a fordító kikényszeríti, hogy stílust is adj neki.
- **`[...products].sort(...)`:** a `sort` helyben módosítja a tömböt. A másolat miatt az eredeti sorrend érintetlen marad.
- **Eltérés a CLAUDE.md content modelljétől:** ott `hasPage: boolean` szerepel. Itt két mező van helyette: `href` (hova linkel a kártya) és `page` (van-e saját oldala). Erre azért van szükség, mert a WordPress és Chrome kártya a CrawlGuard oldalára mutat, de saját oldaluk nincs. Ha átveszed, frissítsd a CLAUDE.md-t is.
- **CrawlGuard szövegek:** szó szerint a CLAUDE.md-ből vannak. A szabály szerint funkciót vagy ígéretet ne tegyél hozzá.

## 4.2 Posztok Markdownban

Hozd létre a három vázlatot a `content/posts/` mappában.

`content/posts/crawlguard-waitlist-first.md`:

```markdown
---
title: "Why I'm building CrawlGuard waitlist-first"
date: ""
tag: "CrawlGuard"
excerpt: "No code before sign-ups. The reasoning, and what has to happen before the first line."
draft: true
---

TODO: write the post.
```

`content/posts/services-to-micro-saas.md`:

```markdown
---
title: "Why I stopped selling services and went all-in on micro-SaaS"
date: ""
tag: "Decisions"
excerpt: "Fewer client projects, more products. What changed my mind, and what I gave up."
draft: true
---

TODO: write the post.
```

`content/posts/three-question-test.md`:

```markdown
---
title: "The three-question test I run before building any idea"
date: ""
tag: "Process"
excerpt: "Have I seen the problem? Do I know where these people are? Can I talk to one this week?"
draft: true
---

TODO: write the post.
```

A fájlnév lesz az URL: `/blog/three-question-test`. Ha publikálsz egy posztot, írd be a dátumot (`date: "2026-11-03"`), és állítsd `draft: false`-ra.

## 4.3 `lib/posts.ts`

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  date: string; // "YYYY-MM-DD", vázlatnál lehet üres
  tag: string;
  excerpt: string;
  draft: boolean;
};

const POSTS_DIR = path.join(process.cwd(), "content/posts");

// Fejlesztés közben a vázlatok is látszanak, élesben nem
const showDrafts = process.env.NODE_ENV === "development";

function readPostFile(slug: string) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
  return matter(raw);
}

// A YAML a nem idézőjeles dátumot Date objektummá alakítja, ezt visszaalakítjuk szöveggé
function toDateString(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value : "";
}

export function getPosts(): Post[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data } = readPostFile(slug);
      return {
        slug,
        title: String(data.title ?? slug),
        date: toDateString(data.date),
        tag: String(data.tag ?? ""),
        excerpt: String(data.excerpt ?? ""),
        draft: data.draft === true,
      };
    })
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date)); // legújabb elöl
}

export async function getPost(slug: string) {
  const post = getPosts().find((p) => p.slug === slug);
  if (!post) return null;

  const { content } = readPostFile(slug);
  return { ...post, html: await marked.parse(content) };
}

export function formatDate(date: string) {
  if (!date) return "Draft";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
```

### Mit tanulsz ebből?

- **`node:fs` szerver komponensben:** a fájlrendszert csak a szerveren lehet olvasni. Ezt a fájlt **soha ne importáld `'use client'` komponensből**, mert a build hibát dob. A server komponensek gond nélkül használhatják.
- **Build időben fut:** az oldalak statikusan generálódnak, így a Markdown fájlokat a `npm run build` olvassa be egyszer. Élesben nincs fájlolvasás.
- **`"Draft"` dátum helyett:** élesben vázlat sosem jelenik meg, ez csak fejlesztés közben látszik.
- **`T00:00:00`:** e nélkül a `new Date("2026-11-03")` UTC éjfélt jelent, ami egy másik időzónában előző napra eshet.

## Ellenőrzés

Ideiglenesen tedd az `app/page.tsx` `<main>`-jébe:

```tsx
<pre>{JSON.stringify(getPosts(), null, 2)}</pre>
```

(importáld: `import { getPosts } from "@/lib/posts";`)

- [ ] `npm run dev` alatt mindhárom vázlat megjelenik JSON-ként
- [ ] ha az egyik posztban `draft: false`-ra állítod, ugyanúgy látszik. Állítsd vissza.
- [ ] utána töröld a `<pre>` sort
