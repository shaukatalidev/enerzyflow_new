

import Solution from "@/components/Solution";
import CustomCursor from "@/components/CustomCursor";
import type { Metadata } from "next";



export const metadata: Metadata = {
  metadataBase: new URL("https://enerzyflow.com"),
  title: "Sustainable Hydration Solutions | Enerzy Flow",
  description:
    "Enerzy Flow is building next-generation sustainable hydration solutions powered by smart technology. Coming soon.",
  keywords: [
  "Sustainable Hydration",
  "Smart Water Solutions",
  "Eco Friendly Hydration",
  "Enerzy Flow",
  "Hydration Technology",
  "Smart Water Dispenser",
  "Eco Hydration Systems",
  "Intelligent Water Solutions",
  "Smart Hydration Devices",
  "Sustainable Water Technology",
  "Water Conservation Tech",
  "IoT Hydration Solutions",
  "Green Hydration Systems",
  "Next Generation Hydration",
  "Smart Water Management",
  "Eco-Friendly Water Dispenser",
  "Hydration Innovation",
  "Sustainable Water Solutions",
  "Smart Drinking Systems",
  "Energy Efficient Hydration"
],

  openGraph: {
    title: "Sustainable Hydration Solutions | Enerzy Flow",
    description:
      "Powerful smart hydration solutions designed for a sustainable future. Coming soon.",
    url: "https://yourdomain.com/solution",
    siteName: "Enerzy Flow",
    images: [
      {
        url: "/images/hero/ai-pos-preview.png",
        width: 1200,
        height: 630,
        alt: "Enerzy Flow Sustainable Hydration",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sustainable Hydration Solutions | Enerzy Flow",
    description:
      "Next-gen sustainable hydration technology. Coming soon.",
    images: ["/images/hero/ai-pos-preview.png"],
  },
};



export default function SolutionsPage() {
  return (
    <>
      <CustomCursor />
      <Solution />
    </>
    
  );
}
