// app/page.tsx
import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.enerzyflow.com/"),
  title: "Enerzyflow – Premium Sustainable Water Bottles",
  description:
    "Enerzyflow offers premium sustainable water bottles with bold design. Eco-friendly, reusable bottles built to reduce plastic waste.",
};

export default function HomePage() {
  return <HomeClient />;
}
