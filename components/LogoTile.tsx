import type { Product } from "@/content/products";

type LogoTileProps = {
  logo: Product["logo"];
  size?: "md" | "lg";
};

export function LogoTile({ logo, size = "md" }: LogoTileProps) {
  const sizeClass =
    size === "lg"
      ? "size-[72px] rounded-[20px] text-[40px]"
      : "size-[52px] rounded-[15px] text-[28px]";

  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center font-display leading-none font-black text-accent [font-stretch:112%] ${sizeClass}`}
      style={{ backgroundColor: logo.color }}
    >
      {logo.letter}
    </span>
  );
}
