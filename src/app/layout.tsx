import type { Metadata, Viewport } from "next";
import { Cinzel_Decorative, Cinzel, Crimson_Pro, Outfit } from "next/font/google";
import "./globals.css";

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-deco",
  weight: ["700", "900"],
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  weight: ["400", "600"],
  subsets: ["latin"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  weight: ["300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0612",
};

export const metadata: Metadata = {
  title: "Oracle of the Pitch — World Cup 2026 Prophecies",
  description:
    "The ancient oracle has studied the celestial ledger. Get your absurd World Cup 2026 match prophecy and share it.",
  openGraph: {
    title: "Oracle of the Pitch 🔮",
    description:
      "The cosmos has already decided. We merely translate. Get your World Cup 2026 prophecy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzelDecorative.variable} ${cinzel.variable} ${crimsonPro.variable} ${outfit.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
