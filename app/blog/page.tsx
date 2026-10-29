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
