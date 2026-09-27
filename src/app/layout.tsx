import type { Metadata, Viewport } from "next";
import { Cinzel_Decorative, Cormorant_Garamond, Inter, Monsieur_La_Doulaise } from "next/font/google";
import { wedding } from "@/config/wedding";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const script = Monsieur_La_Doulaise({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const display = Cinzel_Decorative({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: wedding.couple,
  description: `RSVP for the wedding of ${wedding.couple}`,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#faf6f0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${serif.variable} ${script.variable} ${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
