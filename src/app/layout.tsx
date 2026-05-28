import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "coreframe. — The frame your business is built on.",
  description:
    "Full-stack web development and digital infrastructure for modern business operators. Systems, strategy, and design — built to scale.",
  openGraph: {
    title: "coreframe. — The frame your business is built on.",
    description:
      "Full-stack web development and digital infrastructure for modern business operators. Systems, strategy, and design — built to scale.",
    url: "https://www.coreframe.agency",
    siteName: "coreframe.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "coreframe. — The frame your business is built on.",
    description:
      "Full-stack web development and digital infrastructure for modern business operators. Systems, strategy, and design — built to scale.",
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
        <Nav />
        <main className="pt-[var(--nav-height)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
