import type { Metadata } from "next";
import "./globals.css";
import SparklesCursor from "@/components/ui/Sparklescursor";

export const metadata: Metadata = {
  title: "Motifs — Your Style, Analyzed",
  description: "AI-powered Pinterest style analytics.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SparklesCursor />
        {children}
      </body>
    </html>
  );
}
