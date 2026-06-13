import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "@fontsource/maple-mono/400.css";
import "@fontsource/maple-mono/700.css";
import "./globals.css";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import Helix from "@/components/Helix";
import SiteGuards from "@/components/SiteGuards";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space-mono",
  display: "swap",
});

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
    <html suppressHydrationWarning lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body suppressHydrationWarning className={spaceGrotesk.className}>
        <Cursor />
        <SiteGuards />
        <Nav />
        <Helix />
        {children}
      </body>
    </html>
  );
}
