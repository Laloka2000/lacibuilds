const tones = {
  dark: "bg-ink text-on-navy",
  accent: "bg-accent text-ink",
  outline: "border-2 border-ink text-ink",
};

const sizes = {
  header: "min-h-11 px-3 text-[14px] sm:px-6 sm:text-[16px]", // shares a phone-width row with the logo and menu button
  md: "min-h-12 px-6 text-[16px]",
  lg: "min-h-[52px] px-8 text-[16px]",
};

export type ButtonTone = keyof typeof tones;
export type ButtonSize = keyof typeof sizes;

export function buttonClass(tone: ButtonTone, size: ButtonSize) {
  return [
    "inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap",
    "transition-transform duration-200 ease-brand motion-safe:active:scale-[.97]",
    "disabled:cursor-not-allowed disabled:opacity-60",
    tones[tone],
    sizes[size],
  ].join(" ");
}
