import { SubscribeForm } from "@/components/SubscribeForm";

type WaitlistBandProps = { title: string; text: string };

export function WaitlistBand({ title, text }: WaitlistBandProps) {
  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="wrap scroll-mt-6 pb-[88px]">
      <div className="grid gap-10 rounded-[28px] bg-accent px-7 py-12 text-ink sm:px-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-end lg:p-20">
        <div>
          <h2 id="waitlist-title" className="max-w-[7.5em] font-headline type-band">
            {title}
          </h2>
          <p className="mt-6 max-w-[30rem] text-[18px] leading-[1.6] text-on-accent-muted">{text}</p>
        </div>

        <SubscribeForm
          variant="accent"
          list="waitlist"
          label="Work email"
          buttonLabel="Join the waitlist"
          successMessage="You're on the waitlist. Check your inbox to confirm."
        />
      </div>
    </section>
  );
}
