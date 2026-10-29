import type { ProductStatus } from "@/content/products";

const styles: Record<ProductStatus, { label: string; className: string }> = {
  waitlist: { label: "Waitlist", className: "bg-ink text-accent" },
  planned: { label: "Planned", className: "bg-[#E2E8F0] text-[#334155]" },
  live: { label: "Live", className: "bg-[#DCFCE7] text-[#166534]" },
  beta: { label: "Beta", className: "bg-[#DBEAFE] text-[#1E40AF]" },
  building: { label: "Building", className: "bg-[#FEF3C7] text-[#92400E]" },
  idea: { label: "Idea", className: "text-[#334155] ring-1 ring-[#94A3B8] ring-inset" },
  archived: { label: "Archived", className: "bg-[#E2E8F0] text-[#475569]" },
};

type StatusBadgeProps = {
  status: ProductStatus;
  label?: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = styles[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-[11px] py-1.5 font-mono text-[13px] leading-none font-medium ${style.className}`}
    >
      {label ?? style.label}
    </span>
  );
}
