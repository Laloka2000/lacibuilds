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
