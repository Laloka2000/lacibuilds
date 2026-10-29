import type { Metadata } from "next";
import { site } from "@/lib/site";

type PageMetaInput = {
  title?: string;
  description: string;
  path: string;
};

export function pageMeta({ title, description, path }: PageMetaInput): Metadata {
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
  };
}
