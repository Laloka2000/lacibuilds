import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { NavLink } from "@/lib/site";
import { buttonClass } from "@/lib/styles";

type HeaderProps = {
  links: NavLink[];
  cta: NavLink;
};

export function Header({ links, cta }: HeaderProps) {
  return (
    <header className="wrap flex min-h-[72px] flex-wrap items-center justify-between gap-x-4 py-3">
      <Logo />

      <nav
        aria-label="Main"
        className="order-last -ml-3 w-full sm:order-none sm:ml-auto sm:w-auto"
      >
        <ul className="flex gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-full px-3 font-medium hover:bg-ink/5"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link href={cta.href} className={buttonClass("dark")}>
        {cta.label}
      </Link>
    </header>
  );
}
