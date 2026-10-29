import Link from "next/link";

export function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="relative block size-8 shrink-0 rounded-[9px] bg-navy"
    >
      <span className="absolute right-[7px] bottom-[7px] h-[13px] w-[7px] rounded-[2px] bg-accent" />
    </span>
  );
}

export function Logo() {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-2.5">
      <LogoMark />
      <span className="font-headline text-[19px] tracking-[-0.03em]">
        laci builds
      </span>
    </Link>
  );
}
