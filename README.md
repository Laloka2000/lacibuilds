# Laci Builds

The brand site for Laci Builds: products, build log and newsletter.

Next.js (App Router), Tailwind CSS v4 and GSAP, deployed on Vercel.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 (draft posts are visible) |
| `npm run build` | Production build (draft posts are left out) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Where things live

| Path | Contents |
|---|---|
| `app/globals.css` | Design tokens (`@theme`), type utilities, base styles, reduced motion |
| `lib/site.ts` | Site URL, social links, email, avatar, footer links |
| `content/products.ts` | Products and product page content |
| `content/posts/*.md` | Build log posts (frontmatter: `title`, `date`, `tag`, `excerpt`, `draft`) |
| `lib/newsletter.ts` | The only file that talks to the newsletter provider |
| `components/HeroReveal.tsx` | The GSAP hero entrance animation |

## Environment variables

See `.env.example`. Copy it to `.env.local` locally, and add the same keys in Vercel project settings.

## Before launch

Empty values are hidden on the page, so nothing bracketed ships. Still to fill in (search for `TODO`):

- Photo (`public/` + `site.avatar`), social URLs and contact email in `lib/site.ts`
- CrawlGuard price in `content/products.ts`
- Whether to keep "Revenue: $0/mo, for now" in `components/BrandCard.tsx`
- Newsletter provider and its environment variables
- Posts: set a `date` and `draft: false` to publish
