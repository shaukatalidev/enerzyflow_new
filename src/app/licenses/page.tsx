

import Licenses from '@/components/Licenses';
import CustomCursor from '@/components/CustomCursor';
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Licenses & Certifications | Enerzy Flow",
  description:
    "Explore Enerzy Flow’s licenses, certifications, and regulatory approvals ensuring compliance, quality, and sustainability standards.",
  keywords: [
    "Enerzy Flow Licenses",
    "Certifications",
    "Hydration Technology Compliance",
    "Water Technology Certifications",
    "Startup Legal Compliance",
  ],
  openGraph: {
    title: "Licenses & Certifications | Enerzy Flow",
    description:
      "View Enerzy Flow’s official licenses and certifications that validate our smart hydration technology.",
    url: "https://yourdomain.com/licenses",
    siteName: "Enerzy Flow",
    images: [
      {
        url: "/images/og/licenses-og.png",
        width: 1200,
        height: 630,
        alt: "Enerzy Flow Licenses & Certifications",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Licenses & Certifications | Enerzy Flow",
    description:
      "Official licenses and certifications of Enerzy Flow ensuring trust and compliance.",
    images: ["/images/og/licenses-og.png"],
  },
};



export default function LicensesPage() {
  return (
    <>
      <CustomCursor />
      <Licenses />
    </>
  );
}
