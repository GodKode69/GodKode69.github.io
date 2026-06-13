import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import ClientShell from "@/components/ClientShell";
import SiteGuards from "@/components/SiteGuards";

export const metadata: Metadata = {
  metadataBase: new URL("https://godkode.xyz"),
  title: "GodKode | Portfolio",
  description: "Developer building web apps, desktop tools, APIs, and automation systems.",
  openGraph: {
    type: "website",
    url: "https://godkode.xyz",
    siteName: "GodKode Portfolio",
    title: "GodKode | Portfolio",
    description: "Developer building web apps, desktop tools, APIs, and automation systems.",
    images: [
      {
        url: "https://godkode.xyz/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GodKode | Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GodKode | Portfolio",
    description: "Developer building web apps, desktop tools, APIs, and automation systems.",
    images: ["https://godkode.xyz/opengraph-image"],
  },
  icons: {
    icon: "/assets/img/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#5f9ea0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/space-mono-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/maple-mono-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/maple-mono-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="space-grotesk">
        <ClientShell />
        <SiteGuards />
        <Nav />
        {children}
      </body>
    </html>
  );
}
