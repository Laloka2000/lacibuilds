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
