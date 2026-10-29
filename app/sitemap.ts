import type { MetadataRoute } from "next";
import { getProductsWithPage } from "@/content/products";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getProductsWithPage().map((product) => ({
    url: `${site.url}/products/${product.slug}`,
  }));

  const posts = getPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    ...(post.date && { lastModified: post.date }),
  }));

  return [{ url: site.url }, { url: `${site.url}/blog` }, ...products, ...posts];
}
