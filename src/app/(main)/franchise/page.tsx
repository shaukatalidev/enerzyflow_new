import FranchisePage from '@/components/franchisePage';
import CustomCursor from '@/components/CustomCursor';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EnerzyFlow Franchise Program 2025 | Own the Flow",
  description:
    "Join EnerzyFlow's Franchise Program 2025. Launch your customized water bottle business with manufacturing & tech support, while you handle sales and distribution.",
  keywords: [
    "EnerzyFlow Franchise",
    "Custom Water Bottle Business",
    "Franchise Opportunities India",
    "Sustainable Hydration Startup",
    "Franchise 2025",
  ],
  openGraph: {
    title: "EnerzyFlow Franchise Program 2025",
    description:
      "Become an exclusive EnerzyFlow franchise partner and scale your city with our smart hydration solutions.",
    url: "https://yourdomain.com/franchise",
    siteName: "EnerzyFlow",
    images: [
      {
        url: "/images/og/franchise-og.png",
        width: 1200,
        height: 630,
        alt: "EnerzyFlow Franchise Program",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EnerzyFlow Franchise Program 2025",
    description:
      "Launch your franchise with EnerzyFlow and own the flow of sustainable hydration in your city.",
    images: ["/images/og/franchise-og.png"],
  },
};

export default function FranchisePageWrapper() {
  return (
    <>
      <CustomCursor />
      <FranchisePage />
    </>
  );
}
