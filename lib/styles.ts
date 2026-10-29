const tones = {
  dark: "bg-ink text-on-navy",
  accent: "bg-accent text-ink",
  outline: "border-2 border-ink text-ink",
};

const sizes = {
  sm: "min-h-11 px-6",
  md: "min-h-12 px-6",
  lg: "min-h-[52px] px-8",
};

export type ButtonTone = keyof typeof tones;
export type ButtonSize = keyof typeof sizes;

export function buttonClass(tone: ButtonTone, size: ButtonSize = "sm") {
  return [
    "inline-flex shrink-0 items-center justify-center rounded-full text-[16px] font-semibold whitespace-nowrap",
    "transition-transform duration-200 ease-brand motion-safe:active:scale-[.97]",
    "disabled:cursor-not-allowed disabled:opacity-60",
    tones[tone],
    sizes[size],
  ].join(" ");
}
