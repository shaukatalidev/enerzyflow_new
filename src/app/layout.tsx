// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "./ClientLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EnerzyFlow | The Hospitality OS | Premium Sustainable Branding",
  description:
    "EnerzyFlow turns premium sustainable water bottles into a powerful hospitality data engine. Capture 100% of guest data and automate upselling with our invisible OS.",
  keywords: [
    "Hospitality Operating System",
    "Restaurant Digital Transformation",
    "Smart Water Bottle Branding",
    "Restaurant Guest Data Platform",
    "Sustainable Water Bottles",
    "Digital Concierge Software",
     "EnergyFlow",
    "Enerzy Flow",
    "EnergiFlow",
    "EnrezyFlow",
    "EnerzyFlo",
    "Hospitality OS",
    "Restaurant SAAS",
    "Smart Bottle QR"
  ],
  openGraph: {
    title: "EnerzyFlow – Hardware Locally, Software Globally",
    description:
      "The world's first Hospitality OS powered by premium hydration. Kill plastic waste and unlock 300% profit margins.",
    url: "[https://www.enerzyflow.com/](https://www.enerzyflow.com/)",
    siteName: "EnerzyFlow",
    images: [
      {
        url: "[https://www.enerzyflow.com/og-image.jpg](https://www.enerzyflow.com/og-image.jpg)",
        width: 1200,
        height: 630,
        alt: "EnerzyFlow Premium Smart Bottle",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EnerzyFlow | Sustainable Hospitality Tech",
    description:
      "Turn your water bottles into a profit center. Bold design, premium quality, smart data.",
    images: ["[https://www.enerzyflow.com/og-image.jpg](https://www.enerzyflow.com/og-image.jpg)"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "[https://www.enerzyflow.com/](https://www.enerzyflow.com/)",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark text-white`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
