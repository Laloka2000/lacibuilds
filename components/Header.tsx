import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";
import type { NavLink } from "@/lib/site";
import { buttonClass } from "@/lib/styles";

type HeaderProps = {
  links: NavLink[];
  cta: NavLink;
};

export function Header({ links, cta }: HeaderProps) {
  return (
    <header className="wrap relative z-50 flex min-h-[72px] items-center gap-x-2 py-3 sm:gap-x-4">
      <Logo />

      <nav data-nav aria-label="Main" className="hidden sm:ml-auto sm:block">
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

      <Link href={cta.href} className={`ml-auto sm:ml-0 ${buttonClass("dark", "header")}`}>
        {cta.label}
      </Link>

      <MobileMenu links={links} />
    </header>
  );
}
