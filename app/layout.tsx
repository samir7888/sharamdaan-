import type { Metadata, Viewport } from "next";
import { Mukta, Yatra_One } from "next/font/google";
import { SITE, TITLE, DESC } from "./site";
import "./globals.css";

const body = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "800"],
  variable: "--f-body",
  display: "swap",
});
const display = Yatra_One({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--f-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: "%s | Shramdaan" },
  description: DESC,
  keywords: [
    "हर्क साम्पाङ",
    "श्रम संस्कृति पार्टी",
    "श्रमदान",
    "नेपाली खेल",
    "Harka Sampang",
    "Shram Sanskriti Party",
    "Shramdaan",
    "Nepali game",
    "browser game",
    "Dharan",
  ],
  alternates: { canonical: "/" },
  applicationName: "Shramdaan",
  openGraph: {
    type: "website",
    url: SITE,
    title: TITLE,
    description: DESC,
    siteName: "Shramdaan",
    locale: "ne_NP",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "games",
};
export const viewport: Viewport = {
  themeColor: "#1f2a33",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Shramdaan",
      url: SITE,
      inLanguage: ["ne", "en"],
    },
    {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: "श्रमदान (Shramdaan)",
      description: DESC,
      url: SITE,
      genre: ["Idle", "Clicker"],
      gamePlatform: "Web browser",
      applicationCategory: "Game",
      operatingSystem: "Any",
      inLanguage: ["ne", "en"],
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "NPR" },
    },
  ];
  return (
    <html lang="ne" className={`${body.variable} ${display.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </body>
    </html>
  );
}
