import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTransition } from "@/components/ui/PageTransition";
import { StickyCTA } from "@/components/ui/StickyCTA";
import "./globals.css";

export const metadata: Metadata = {
  title: "coreframe. — Systems / Strategy / Design",
  description: "We build the digital infrastructure behind modern businesses.",
  metadataBase: new URL("https://coreframe.agency"),
  openGraph: {
    title: "coreframe. — Systems / Strategy / Design",
    description: "We build the digital infrastructure behind modern businesses.",
    url: "https://coreframe.agency",
    siteName: "coreframe.",
    images: [
      {
        url: "https://coreframe.agency/og-image.png",
        width: 1200,
        height: 630,
        alt: "coreframe. — Systems / Strategy / Design",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "coreframe. — Systems / Strategy / Design",
    description: "We build the digital infrastructure behind modern businesses.",
    images: ["https://coreframe.agency/og-image.png"],
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
