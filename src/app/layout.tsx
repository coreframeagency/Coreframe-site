import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTransition } from "@/components/ui/PageTransition";
import { StickyCTA } from "@/components/ui/StickyCTA";
import "./globals.css";

export const metadata: Metadata = {
  title: "coreframe. — The frame your business is built on.",
  description:
    "Full-stack web development and digital infrastructure for modern business operators. Systems, strategy, and design — built to scale.",
  metadataBase: new URL("https://www.coreframe.agency"),
  openGraph: {
    title: "coreframe. — The frame your business is built on.",
    description:
      "Full-stack web development and digital infrastructure for modern business operators. Systems, strategy, and design — built to scale.",
    url: "https://www.coreframe.agency",
    siteName: "coreframe.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "coreframe. — The frame your business is built on.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "coreframe. — The frame your business is built on.",
    description:
      "Full-stack web development and digital infrastructure for modern business operators. Systems, strategy, and design — built to scale.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CustomCursor />
        <PageTransition />
        <Nav />
        <main className="pt-[var(--nav-height)]">{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  );
}
