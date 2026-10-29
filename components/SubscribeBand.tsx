import { SubscribeForm } from "@/components/SubscribeForm";

export function SubscribeBand() {
  return (
    <section id="subscribe" aria-labelledby="subscribe-title" className="wrap scroll-mt-6 pb-[88px]">
      <div
        data-surface="dark"
        className="grid gap-10 rounded-[28px] bg-navy px-7 py-12 text-on-navy sm:px-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-end lg:p-20"
      >
        <div>
          <h2 id="subscribe-title" className="max-w-[7.5em] font-headline type-band">
            Follow the <span className="text-accent">build.</span>
          </h2>
          <p className="mt-6 max-w-[30rem] text-[18px] leading-[1.6] text-on-navy-muted">
            One email every other week: what I shipped, what broke, what I learned and what&apos;s
            next.
          </p>
        </div>

        <SubscribeForm
          variant="navy"
          list="newsletter"
          label="Email address"
          buttonLabel="Subscribe"
          successMessage="Thanks, you're subscribed. Check your inbox to confirm."
        />
      </div>
    </section>
  );
}
