import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";

export function BuildLogRow({ post }: { post: Post }) {
  return (
    <li className="border-b border-border-list">
      <Link
        href={`/blog/${post.slug}`}
        className="group grid gap-x-8 gap-y-3 px-4 py-7 hover:bg-row-hover md:grid-cols-[8.5rem_minmax(0,1fr)_auto] md:items-center"
      >
        <time dateTime={post.date || undefined} className="font-mono text-[14px] text-text-muted">
          {formatDate(post.date)}
        </time>

        <div>
          <h3 className="font-display text-[clamp(22px,2.2vw,28px)] leading-[1.1] font-[750] tracking-[-0.025em] [font-stretch:106%]">
            {post.title}
          </h3>
          <p className="mt-2 text-[17px] leading-[1.55] text-text-muted">{post.excerpt}</p>
        </div>

        <div className="flex items-center gap-5">
          <span className="rounded-full border border-ink px-3.5 py-1.5 font-mono text-[13px]">
            {post.tag}
          </span>
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-on-navy"
          >
            <span className="transition-transform duration-300 ease-brand motion-safe:group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}
