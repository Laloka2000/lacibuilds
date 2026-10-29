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
