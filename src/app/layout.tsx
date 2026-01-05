// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "./ClientLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.enerzyflow.com/"),
  title: "EnerzyFlow | The Hospitality OS | Premium Sustainable Branding",
  description:
    "EnerzyFlow turns premium sustainable water bottles into a powerful hospitality data engine. Capture 100% of guest data and automate upselling with our invisible OS.",
 keywords: [
  // Primary Industry Keywords
  "Hospitality Operating System",
  "Restaurant Digital Transformation",
  "Smart Water Bottle Branding",
  "Restaurant Guest Data Platform",
  "Sustainable Water Bottles",
  "Digital Concierge Software",
  "Hospitality OS",
  "Restaurant SAAS",
  "Smart Bottle QR",
  
  // Brand & Misspellings (Phonetic & Typos)
  "EnerzyFlow", "EnergyFlow", "Enerzy Flow", "Energy Flow", "EnergiFlow", 
  "Energi Flow", "EnrgyFlow", "Enrgy Flow", "EnrezyFlow", "EnerzyFlo", 
  "Enerzy-Flow", "Energy-Flow", "EnerzyFlows", "EnerzeeFlow", "Enerze Flow", 
  "InerzyFlow", "InergyFlow", "EnerjyFlow", "Enerjy Flow", "EnarzyFlow", 
  "Enarzy Flow", "EnerziFlow", "Enerzi Flow", "EneryFlow", "Enery Flow", 
  "EnercyFlow", "Enercy Flow", "EnerzlyFlow", "EnerzyFloe", "EnerzyFloh", 
  "Enerzy Vlow", "Enerzy Blow", "Enerzy Glow", "Enerzy Flw", "Enerzy Folw", 
  "Enerzy Fowl", "Enerzy Floow", "Enerzy Phlow", "Enerzy Phlows", "Enerzy Pflow", 
  "Enerzy Fllo", "EnurzyFlow", "Enurzy Flow", "EnerxyFlow", "Enerxy Flow", 
  "EnerztFlow", "Enerzt Flow", "EnerzuFlow", "Enerzu Flow", "EnerzyFow", 
  "EnerzyFllow", "EnerzyFlwo", "EnerzyFlou", "EnerzyFlouh", "EnezryFlow", 
  "Enezry Flow", "EnezyFlow", "Enezy Flow", "EnarzyFlo",
  
  // Generic Typos & Phase Variations
  "energy flo", "energy floe", "energy floh", "energy flw", "energy flowe", 
  "energy flows", "energy floww", "energy fllow", "energy vlow", "energy blow", 
  "energy glow", "energy slow", "energy folw", "energy flwo", "energy flou", 
  "energy phlow", "energy pflow", "energy-flow", "energy_flow", "energyflow app", 
  "energyflow water", "energyflow tech", "energyflow system", "energy flo tech", 
  "energy flo system", "enegy flow", "enrgy flow", "enery flow", "energey flow", 
  "enegry flow", "enirgy flow", "enurgy flow", "enrgyflow", "enegryflow", 
  "energeyflow", "enirgyflow", "energy flow branding", "energy flow bottle", 
  "energy flow hospitality", "energy flou system", "energy flo branding", 
  "energy flow os", "energy flo os", "energy flowe system", "energy flowe branding", 
  "energy flowe os", "energy flowe bottle", "energy flows system", "energy flows branding"
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
