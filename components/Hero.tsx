import { Avatar } from "@/components/Avatar";
import { BrandCard } from "@/components/BrandCard";
import { HeroReveal } from "@/components/HeroReveal";
import { SubscribeForm } from "@/components/SubscribeForm";

export function Hero() {
  return (
    <section className="overflow-x-clip">
      <HeroReveal className="wrap grid items-center gap-16 pt-12 pb-[88px] lg:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <div data-hero-item="0" className="flex items-center gap-4">
            <Avatar size={56} ring="ring-3" />
            <div>
              <p className="text-[17px] font-semibold">Laci Lelovics</p>
              <p className="text-[15px] text-text-muted">Full-stack developer, Hungary</p>
            </div>
          </div>

          <h1 data-hero-item="1" className="mt-8 font-headline type-h1">
            Small SaaS tools, built <span className="highlight">in public.</span>
          </h1>

          <p data-hero-item="2" className="mt-7 max-w-[34rem] text-[20px] leading-[1.55] text-text-strong">
            Laci Builds is my one-person product studio. Every product fixes a problem I&apos;ve
            hit myself as a developer.
          </p>

          <div data-hero-item="3" className="mt-10 max-w-[520px]">
            <SubscribeForm
              list="newsletter"
              label="Get the build log, every other week"
              buttonLabel="Subscribe"
              successMessage="Thanks, you're subscribed. Check your inbox to confirm."
            />
          </div>
        </div>

        <div data-hero-item="3">
          <BrandCard />
        </div>
      </HeroReveal>
    </section>
  );
}
