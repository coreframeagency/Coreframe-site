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
      <head>
        {/*
          PLACEHOLDER: Brand fonts
          Replace --font-display-placeholder and --font-body-placeholder
          with @font-face declarations or next/font imports when assets are provided.
        */}
        <style>{`
          :root {
            --font-display-placeholder: ui-sans-serif, system-ui, sans-serif;
            --font-body-placeholder: ui-sans-serif, system-ui, sans-serif;
          }
        `}</style>
      </head>
      <body className="font-body antialiased">
        <CustomCursor />
        <Nav />
        <main className="pt-[var(--nav-height)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
