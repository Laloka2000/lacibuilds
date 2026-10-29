const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: "Laci Builds",
  description:
    "Laci Builds is a one-person product studio. Small SaaS tools for developers, built in public.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (productionUrl ? `https://${productionUrl}` : "http://localhost:3000"),
  // TODO: add the photo to public/ and set e.g. "/laci.jpg"
  avatar: null as string | null,
  // TODO: shown in the FAQ intro once set
  email: "",
  handle: "@laci.builds",
  cvUrl: "https://lelovicslaszlo.hu",
};

// TODO: fill in the profile URLs. Links with an empty href are not rendered.
const allSocials = [
  { label: "X", href: "" },
  { label: "GitHub", href: "" },
  { label: "TikTok", href: "" },
  { label: "Instagram", href: "" },
  { label: "Threads", href: "" },
];

export const socials = allSocials.filter((s) => s.href);

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  muted?: boolean;
};

export const homeFooterLinks: NavLink[] = [
  ...socials.map((s) => ({ ...s, external: true })),
  { label: "Developer CV ↗", href: site.cvUrl, external: true, muted: true },
];

export const productFooterLinks: NavLink[] = [
  { label: "All products", href: "/#products" },
  { label: "Build log", href: "/blog" },
  ...socials
    .filter((s) => s.label === "X" || s.label === "GitHub")
    .map((s) => ({ ...s, external: true })),
];
