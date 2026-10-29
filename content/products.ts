export type ProductStatus =
  | "live"
  | "beta"
  | "building"
  | "waitlist"
  | "planned"
  | "idea"
  | "archived";

export type ProductPage = {
  headline: string;
  intro: string;
  glance: { label: string; value: string }[];
  stepsTitle: string;
  stepsIntro: string;
  steps: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  waitlist: boolean;
  bandTitle: string;
  bandText: string;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  status: ProductStatus;
  platform: string;
  metric?: string;
  logo: { letter?: string; color: string };
  order: number;
  href?: string;
  page?: ProductPage;
};

const products: Product[] = [
  {
    slug: "crawlguard",
    name: "CrawlGuard",
    tagline: "Catch technical SEO regressions in pull requests, before they ship.",
    status: "waitlist",
    platform: "GitHub Action",
    logo: { letter: "C", color: "#0B1630" },
    order: 1,
    href: "/products/crawlguard",
    page: {
      headline: "CrawlGuard",
      intro:
        "Catch technical SEO regressions in your pull requests, before they reach production.",
      glance: [
        { label: "Built for", value: "Dev teams and agencies" },
        { label: "Ships first as", value: "GitHub Action" },
        { label: "Coming later", value: "WordPress plugin, Chrome extension" },
        { label: "Price", value: "" }, // TODO: hidden while empty
        { label: "Status", value: "Building starts with sign-ups" },
      ],
      stepsTitle: "How it will work",
      stepsIntro: "The planned flow. The details get shaped together with the waitlist.",
      steps: [
        {
          title: "Add it to your workflow",
          text: "Drop the CrawlGuard Action into your repository, next to your other checks.",
        },
        {
          title: "Open a pull request",
          text: "CrawlGuard checks the changes for technical SEO breakage.",
        },
        {
          title: "Fix it before merge",
          text: "Problems show up on the PR, so they never reach production.",
        },
      ],
      faq: [
        {
          q: "What does CrawlGuard check?",
          a: "Technical SEO basics that tend to break quietly during a deploy, like an accidental noindex, a missing canonical tag or a changed robots.txt. The full list is being shaped with the people on the waitlist.",
        },
        {
          q: "Is it available yet?",
          a: "Not yet. CrawlGuard is waitlist-first: I start building once enough people sign up, and the waitlist gets access first.",
        },
        {
          q: "Who is it for?",
          a: "Dev teams and agencies that ship website changes through GitHub pull requests, and don't want SEO problems to reach production.",
        },
        {
          q: "How much will it cost?",
          a: "Pricing isn't decided yet. People on the waitlist hear it first, and their feedback helps set it.",
        },
        {
          q: "Will there be a WordPress version?",
          a: "Yes. After the GitHub Action, a free WordPress plugin and a Chrome extension are planned.",
        },
        {
          q: "Who's building it?",
          a: "Me, Laci Lelovics, a full-stack developer from Hungary. I'm building CrawlGuard in public, and every step goes into the build log.",
        },
      ],
      waitlist: true,
      bandTitle: "Get in before launch.",
      bandText: "Join the waitlist and help decide what CrawlGuard checks first.",
    },
  },
  {
    slug: "crawlguard-wordpress",
    name: "CrawlGuard for WordPress",
    tagline: "The same checks as a free plugin, for WordPress site owners.",
    status: "planned",
    platform: "WordPress plugin",
    logo: { letter: "C", color: "#0B1630" },
    order: 2,
    href: "/products/crawlguard",
  },
  {
    slug: "crawlguard-chrome",
    name: "CrawlGuard for Chrome",
    tagline: "CrawlGuard checks on any page you open, as a browser extension.",
    status: "planned",
    platform: "Chrome extension",
    logo: { letter: "C", color: "#0B1630" },
    order: 3,
    href: "/products/crawlguard",
  },
];

export function getProducts() {
  return [...products].sort((a, b) => a.order - b.order);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsWithPage() {
  return getProducts().filter((p) => p.page);
}
