import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modular Equity — Private Real Estate Investments",
  description:
    "Private equity focused on real estate renovations and fix-and-flip projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased font-sans`}
      >
        <Providers>
          <SiteHeader />
          <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
