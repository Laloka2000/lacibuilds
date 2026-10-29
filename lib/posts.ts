import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  draft: boolean;
};

const POSTS_DIR = path.join(process.cwd(), "content/posts");

const showDrafts = process.env.NODE_ENV === "development";

function readPostFile(slug: string) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
  return matter(raw);
}

function toDateString(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value : "";
}

export function getPosts(): Post[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data } = readPostFile(slug);
      return {
        slug,
        title: String(data.title ?? slug),
        date: toDateString(data.date),
        tag: String(data.tag ?? ""),
        excerpt: String(data.excerpt ?? ""),
        draft: data.draft === true,
      };
    })
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  const post = getPosts().find((p) => p.slug === slug);
  if (!post) return null;

  const { content } = readPostFile(slug);
  return { ...post, html: await marked.parse(content) };
}

export function formatDate(date: string) {
  if (!date) return "Draft";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
