import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "coreframe. — The frame your business is built on.",
  description:
    "The frame your business is built on. We design and build the digital systems behind modern businesses. Full-stack web development, custom business systems, and operational infrastructure.",
  metadataBase: new URL("https://coreframe.agency"),
  openGraph: {
    title: "coreframe. — The frame your business is built on.",
    description:
      "The frame your business is built on. We design and build the digital systems behind modern businesses.",
    url: "https://coreframe.agency",
    siteName: "coreframe.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "coreframe. — The frame your business is built on.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "coreframe. — The frame your business is built on.",
    description:
      "The frame your business is built on. We design and build the digital systems behind modern businesses.",
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
        <Nav />
        <main className="pt-[var(--nav-height)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
