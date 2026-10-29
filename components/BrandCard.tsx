import { Avatar } from "@/components/Avatar";
import { site, socials } from "@/lib/site";

const facts = [
  { label: "Now building", value: "CrawlGuard" },
  { label: "Built for", value: "Developers and agencies" },
  { label: "Rule", value: "One product at a time" },
  { label: "Revenue", value: "$0/mo, for now" }, // TODO: decide whether to keep this
];

export function BrandCard() {
  return (
    <div className="group relative mx-auto w-full max-w-[420px] lg:mx-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-4 translate-y-5 rotate-4 rounded-[28px] bg-accent transition-transform duration-700 ease-brand motion-safe:group-hover:translate-x-7 motion-safe:group-hover:rotate-8"
      />

      <div
        data-surface="dark"
        className="relative -rotate-3 rounded-[28px] bg-navy p-8 text-on-navy shadow-brand transition-transform duration-700 ease-brand sm:p-10 motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:rotate-0"
      >
        <div className="flex items-center justify-between gap-4 font-mono text-[13px]">
          <span className="text-on-navy-muted">Laci Builds</span>
          <span className="text-accent">building in public</span>
        </div>

        <p className="mt-7 font-headline text-[34px] leading-none tracking-[-0.03em] text-accent">
          A one-person product studio.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-[12px] text-on-navy-label">{fact.label}</dt>
              <dd className="mt-1.5 text-[17px] leading-snug font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 border-t border-navy-line pt-6">
          <div className="flex items-center gap-3">
            <Avatar size={36} ring="ring-2" />
            <span className="font-semibold">{site.handle}</span>
          </div>
          {socials.length > 0 && (
            <ul className="mt-3 -ml-2 flex flex-wrap">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center px-2 text-[15px] text-on-navy-link hover:text-on-navy hover:underline"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
