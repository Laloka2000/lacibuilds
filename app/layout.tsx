import type { Metadata } from "next";
import { Archivo, DM_Mono, Onest } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Laci Builds: small SaaS tools, built in public",
    template: "%s | Laci Builds",
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${onest.variable} ${dmMono.variable}`}
    >
      <body className="font-sans text-ink">
        {children}
        <noscript>
          <style>{"[data-hero-item]{visibility:visible!important}"}</style>
        </noscript>
      </body>
    </html>
  );
}
