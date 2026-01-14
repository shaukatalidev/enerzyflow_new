

import VideoPlayer from "@/components/Vedio"; 
import CustomCursor from "@/components/CustomCursor";
import type { Metadata } from "next";


export const metadata: Metadata = {
  metadataBase: new URL("https://enerzyflow.com"),
  title: "AI POS System | Enerzy Flow – Invisible Operating System",
  description:
    "Enerzy Flow AI POS is an invisible operating system enabling frictionless ordering, AI-powered offers, auto inventory tracking, and customer retention using QR-based menus.",
  keywords: [
    "AI POS",
    "QR Ordering System",
    "Restaurant POS Software",
    "AI Inventory Management",
    "Smart Restaurant Technology",
    "Enerzy Flow AI POS",
  ],
  openGraph: {
    title: "Enerzy Flow AI POS – Invisible Operating System",
    description:
      "Scan. Order. Pay. Powered by AI. No downloads, no friction.",
    url: "https://yourdomain.com/software",
    siteName: "Enerzy Flow",
    images: [
      {
        url: "/images/hero/ai-pos-preview.png",
        width: 1200,
        height: 630,
        alt: "Enerzy Flow AI POS System",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enerzy Flow AI POS – Invisible Operating System",
    description:
      "AI-powered POS for frictionless ordering & inventory automation.",
    images: ["/images/hero/ai-pos-preview.png"],
  },
};




export default function VideoPage() {
  return (
    <>
    <div className="mt-20">
      <CustomCursor />
      <VideoPlayer />
      </div>
    </>
  );
}
