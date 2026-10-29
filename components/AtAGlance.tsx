type AtAGlanceProps = {
  items: { label: string; value: string }[];
};

export function AtAGlance({ items }: AtAGlanceProps) {
  const visible = items.filter((item) => item.value);

  return (
    <aside aria-labelledby="glance-title" className="rounded-[28px] border border-border bg-surface p-8 sm:p-10">
      <h2 id="glance-title" className="font-display text-[23px] font-[750] tracking-[-0.025em] [font-stretch:108%]">
        At a glance
      </h2>
      <dl className="mt-6 space-y-5">
        {visible.map((item) => (
          <div key={item.label}>
            <dt className="font-mono text-[13px] text-text-muted">{item.label}</dt>
            <dd className="mt-1 text-[17px] font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
