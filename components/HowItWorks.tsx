import type { ProductPage } from "@/content/products";

type HowItWorksProps = Pick<ProductPage, "stepsTitle" | "stepsIntro" | "steps">;

export function HowItWorks({ stepsTitle, stepsIntro, steps }: HowItWorksProps) {
  return (
    <section aria-labelledby="how-title" className="wrap pb-28">
      <div
        data-surface="dark"
        className="grid gap-10 rounded-[28px] bg-navy px-7 py-12 text-on-navy sm:px-12 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:p-16"
      >
        <div>
          <h2 id="how-title" className="max-w-[6em] font-headline type-h2">
            {stepsTitle}
          </h2>
          <p className="mt-6 max-w-[28rem] text-[18px] leading-[1.6] text-on-navy-muted">{stepsIntro}</p>
        </div>

        <ol className="divide-y divide-navy-line">
          {steps.map((step) => (
            <li key={step.title} className="flex gap-4 py-7 first:pt-0 last:pb-0">
              <span aria-hidden="true" className="mt-2.5 size-3 shrink-0 rounded-[3px] bg-accent" />
              <div>
                <h3 className="font-display text-[26px] leading-[1.15] font-[750] tracking-[-0.025em] [font-stretch:106%]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[17px] leading-[1.6] text-on-navy-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
