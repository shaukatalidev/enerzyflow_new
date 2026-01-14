

import BrandLogos from "@/components/BrandLogos";
import CustomCursor from "@/components/CustomCursor";
import type { Metadata } from "next";


export const metadata: Metadata = {
  metadataBase: new URL("https://enerzyflow.com"),
  title: "Trusted Brands | Our Partners & Collaborations",
  description:
    "Explore the trusted brands and partners we collaborate with to deliver premium quality products.",
  keywords: [
    "trusted brands",
    "our partners",
    "brand collaborations",
    "premium brands",
  ],
  openGraph: {
    title: "Our Trusted Brand Partners",
    description:
      "We collaborate with leading brands to ensure premium quality and trust.",
    url: "https://yourdomain.com/brands",
    siteName: "Your Brand Name",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};



export default function BrandLogsPage() {
  return (
    <>
      <CustomCursor />
      <BrandLogos />
    </>
  );
}
