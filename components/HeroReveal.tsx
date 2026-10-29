"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, CustomEase);

const DELAYS = [0.06, 0.14, 0.22, 0.32];

type HeroRevealProps = {
  children: React.ReactNode;
  className?: string;
};

export function HeroReveal({ children, className }: HeroRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        CustomEase.create("brand", ".16,1,.3,1");

        gsap.fromTo(
          "[data-hero-item]",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "brand",
            delay: (_index: number, el: HTMLElement) => DELAYS[Number(el.dataset.heroItem)] ?? 0,
            clearProps: "transform",
          },
        );
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
