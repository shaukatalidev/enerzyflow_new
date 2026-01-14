

import Invest from '@/components/Invest';
import CustomCursor from '@/components/CustomCursor';
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Invest in Enerzy Flow | Smart Sustainable Hydration",
  description:
    "Invest in Enerzy Flow and be part of the future of smart, sustainable hydration technology. Explore our vision, growth potential, and investment opportunities.",
  keywords: [
    "Invest in Enerzy Flow",
    "Hydration Startup Investment",
    "Sustainable Tech Investment",
    "Smart Water Technology",
    "Startup Investment India",
  ],
  openGraph: {
    title: "Invest in Enerzy Flow",
    description:
      "Join Enerzy Flow as an investor and help scale the future of smart hydration solutions.",
    url: "https://yourdomain.com/invest",
    siteName: "Enerzy Flow",
    images: [
      {
        url: "/images/og/invest-og.png",
        width: 1200,
        height: 630,
        alt: "Invest in Enerzy Flow",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invest in Enerzy Flow",
    description:
      "Be part of Enerzy Flow’s mission to redefine hydration with smart technology.",
    images: ["/images/og/invest-og.png"],
  },
};




export default function InvestPage() {
  return (
    <>
      <CustomCursor />
      <Invest />
    </>
  );
}
