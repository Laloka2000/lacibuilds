import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { NavLink } from "@/lib/site";

export function Footer({ links }: { links: NavLink[] }) {
  return (
    <footer className="wrap flex flex-col gap-6 pt-10 pb-12 md:flex-row md:items-center md:justify-between">
      <Logo />

      <ul className="-ml-2 flex flex-wrap gap-x-1 md:ml-0">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
              className={`inline-flex min-h-11 items-center px-2 hover:underline ${
                link.muted ? "text-text-muted" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-[15px] text-text-muted">© 2026 Laci Builds</p>
    </footer>
  );
}
