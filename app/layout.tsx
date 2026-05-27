import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import Helix from "@/components/Helix";

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
  title: "GodKode | Portfolio",
  description: "Teeny tiny wannabe gamedev",
  openGraph: {
    type: "website",
    title: "GodKode's Website",
    description: "Teeny tiny wannabe gamedev",
    images: ["https://godkode.xyz/assets/img/wink.png"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#5f9ea0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body suppressHydrationWarning className={spaceGrotesk.className}>
        <Cursor />
        <Nav />
        <Helix />
        {children}
      </body>
    </html>
  );
}
