"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavLink } from "@/lib/site";

const bar =
  "absolute top-1/2 left-1/2 -mt-px -ml-[9px] h-0.5 w-[18px] rounded-full bg-ink transition-[translate,rotate,opacity] duration-400 ease-brand";

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
    };
    // Tailwind's sm breakpoint: above it the desktop nav takes over
    const desktop = window.matchMedia("(min-width: 40rem)");

    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", close);

    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", close);
    };
  }, [open]);

  return (
    <div
      className="shrink-0 sm:hidden"
      onBlur={(event) => {
        // Tabbing out must not leave focus behind the scrim
        const next = event.relatedTarget;
        if (next && !event.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-10 bg-page/80 transition-opacity ease-brand ${
          open ? "duration-500" : "pointer-events-none opacity-0 duration-200"
        }`}
      />

      <button
        ref={toggleRef}
        type="button"
        data-menu-toggle
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
        className="relative z-20 block size-11 shrink-0 rounded-full border border-ink bg-page transition-transform duration-200 ease-brand motion-safe:active:scale-[.97]"
      >
        <span className={`${bar} ${open ? "rotate-45" : "-translate-y-1.5"}`} />
        <span className={`${bar} ${open ? "opacity-0" : ""}`} />
        <span className={`${bar} ${open ? "-rotate-45" : "translate-y-1.5"}`} />
      </button>

      <nav
        id="mobile-menu"
        aria-label="Main"
        data-surface="dark"
        inert={!open}
        className={`absolute inset-x-6 top-full z-20 origin-top-right rounded-[28px] bg-navy px-6 py-3 text-on-navy shadow-brand transition-[opacity,translate,scale] ease-brand ${
          open ? "duration-500" : "pointer-events-none -translate-y-2 scale-[.98] opacity-0 duration-200"
        }`}
      >
        <ul className="divide-y divide-navy-line">
          {links.map((link, index) => (
            <li
              key={link.href}
              style={{ transitionDelay: open ? `${80 + index * 60}ms` : undefined }}
              className={`transition-[opacity,translate] ease-brand ${
                open ? "duration-500" : "translate-y-2 opacity-0 duration-150"
              }`}
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="group flex min-h-[72px] items-center justify-between gap-4 font-headline text-[34px] leading-none tracking-[-0.03em]"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="text-[24px] text-accent transition-transform duration-300 ease-brand motion-safe:group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
