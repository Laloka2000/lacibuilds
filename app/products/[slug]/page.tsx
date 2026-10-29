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
