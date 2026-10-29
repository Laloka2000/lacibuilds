import Image from "next/image";
import { site } from "@/lib/site";

type AvatarProps = { size: number; ring: "ring-2" | "ring-3" };

export function Avatar({ size, ring }: AvatarProps) {
  const className = `shrink-0 rounded-full ${ring} ring-accent`;

  if (!site.avatar) {
    return (
      <span
        aria-hidden="true"
        className={`block bg-[#D5DCE5] ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Image src={site.avatar} alt="" width={size} height={size} className={`object-cover ${className}`} />
  );
}
