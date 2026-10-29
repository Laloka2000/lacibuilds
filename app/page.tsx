import Link from "next/link";
import { BuildLogRow } from "@/components/BuildLogRow";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { SubscribeBand } from "@/components/SubscribeBand";
import { getProducts } from "@/content/products";
import { getPosts } from "@/lib/posts";
import { pageMeta } from "@/lib/seo";
import { homeFooterLinks, site } from "@/lib/site";

export const metadata = pageMeta({ description: site.description, path: "/" });

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
