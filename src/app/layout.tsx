import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTransition } from "@/components/ui/PageTransition";
import { StickyCTA } from "@/components/ui/StickyCTA";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "COREFRAME — Systems / Strategy / Design",
    template: "%s | COREFRAME",
  },
  description:
    "COREFRAME is a premium full-stack web development studio. We build the digital infrastructure behind modern businesses.",
  keywords: [
    "web development",
    "full stack",
    "Next.js",
    "Sri Lanka",
    "web agency",
    "custom web app",
    "systems design",
    "COREFRAME",
  ],
  authors: [{ name: "COREFRAME", url: "https://coreframe.agency" }],
  creator: "COREFRAME",
  metadataBase: new URL("https://coreframe.agency"),
  alternates: {
    canonical: "https://coreframe.agency",
  },
  openGraph: {
    title: "COREFRAME — Systems / Strategy / Design",
    description:
      "We build the digital infrastructure behind modern businesses.",
    url: "https://coreframe.agency",
    siteName: "COREFRAME",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "COREFRAME — Systems / Strategy / Design",
    description:
      "We build the digital infrastructure behind modern businesses.",
    creator: "@coreframe",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
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
