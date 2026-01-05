

import About from '@/components/About';
import CustomCursor from '@/components/CustomCursor';
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://enerzyflow.com"),
  title: "About Us | Enerzy Flow",
  description:
    "Learn more about Enerzy Flow — our mission, vision, and innovative approach to sustainable hydration solutions.",
  keywords: [
    "About Enerzy Flow",
    "Sustainable Hydration Company",
    "Smart Water Solutions",
    "Hydration Technology Startup",
    "Enerzy Flow India",
  ],
  openGraph: {
    title: "About Enerzy Flow",
    description:
      "Discover Enerzy Flow’s journey toward building smart and sustainable hydration solutions.",
    url: "https://yourdomain.com/about",
    siteName: "Enerzy Flow",
    images: [
      {
        url: "/images/og/about-og.png",
        width: 1200,
        height: 630,
        alt: "About Enerzy Flow",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Enerzy Flow",
    description:
      "Enerzy Flow is redefining hydration through sustainable smart technology.",
    images: ["/images/og/about-og.png"],
  },
};




export default function AboutPage() {
  return (
    <>
      <CustomCursor />
      <About />
    </>
  );
}
