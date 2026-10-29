import { site } from "@/lib/site";

type FaqProps = {
  items: { q: string; a: string }[];
};

export function Faq({ items }: FaqProps) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="wrap scroll-mt-6 pb-28">
      <div className="grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 id="faq-title" className="font-headline type-h2">
            FAQ
          </h2>
          {site.email && (
            <p className="mt-5 max-w-[28rem] text-[18px] leading-[1.6] text-text-muted">
              Something else on your mind? Email me at{" "}
              <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-3">
                {site.email}
              </a>
              .
            </p>
          )}
        </div>

        <div className="border-t border-border-list">
          {items.map((item, index) => (
            <details key={item.q} name="faq" open={index === 0} className="group border-b border-border-list">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-4 py-6 hover:bg-row-hover [&::-webkit-details-marker]:hidden">
                <span className="font-display text-[21px] leading-tight font-[750] tracking-[-0.02em] [font-stretch:106%]">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-ink text-[18px] transition-transform duration-400 ease-brand group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[44rem] px-4 pb-8 text-[17px] leading-[1.65] text-text-strong">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
