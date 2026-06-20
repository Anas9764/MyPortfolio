import type { Metadata } from "next";
import "./globals.css";
import "@/styles/portfolio.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Portfolio",
    template: "%s",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/HeroImage.jpg" />
        <link rel="apple-touch-icon" href="/HeroImage.jpg" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
