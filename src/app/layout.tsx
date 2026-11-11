import { Metadata } from "next";
import { Barlow, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import TransitionProvider from "@/components/transition/TransitionProvider";
import "./globals.css";

// Tall condensed caps for titles, a clean sans for UI text, mono for small system readouts.
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--nf-display",
});

const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--nf-body",
});

const system = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--nf-system",
});

export const metadata: Metadata = {
  title: "Portfolio Admin",
  description: "Private control panel for the portfolio",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${system.variable}`}>
      <body className="font-body antialiased">
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
