import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motifs — Your Style, Analyzed",
  description: "AI-powered Pinterest style analytics. Discover your aesthetic patterns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
