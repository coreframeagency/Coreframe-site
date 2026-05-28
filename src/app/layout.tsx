import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "COREFRAME — Systems / Strategy / Design",
    template: "%s — COREFRAME",
  },
  description:
    "COREFRAME builds digital systems for business owners. Systems, strategy, and design — infrastructure that works, scales, and looks like it means business.",
  icons: {
    icon: "/favicon.png",
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
