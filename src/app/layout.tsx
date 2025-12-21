import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import Loader from "@/components/Loader";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

/* =======================
   GLOBAL SEO METADATA
   ======================= */
export const metadata: Metadata = {
  metadataBase: new URL("https://enerzyflow.com"), // ✅ REQUIRED

  title: {
    default: "EnerzyFlow – Bottles With a Voice",
    template: "%s | EnerzyFlow",
  },

  description:
    "EnerzyFlow creates smart, customizable bottles that communicate your brand’s message effectively.",

  openGraph: {
    title: "EnerzyFlow – Bottles With a Voice",
    description:
      "Smart, customizable bottles that communicate your brand’s message effectively.",
    url: "https://enerzyflow.com",
    siteName: "EnerzyFlow",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EnerzyFlow Smart Bottles",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "EnerzyFlow – Bottles With a Voice",
    description:
      "Smart, customizable bottles that communicate your brand’s message effectively.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

/* =======================
   ROOT LAYOUT
   ======================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-dark text-white overflow-x-hidden cursor-none min-h-screen`}
      >
        {/* 🔔 Global Toast Notifications */}
        <Toaster
          position="top-center"
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0F0F0F",
              color: "#ffffff",
              border: "1px solid rgba(0,240,255,0.3)",
              boxShadow: "0 0 20px rgba(0,240,255,0.25)",
            },
            success: {
              style: {
                background: "#00F0FF",
                color: "#000000",
              },
            },
            error: {
              style: {
                background: "#ef4444",
                color: "#ffffff",
              },
            },
            loading: {
              style: {
                background: "#0F0F0F",
                color: "#00F0FF",
              },
            },
          }}
        />

        {/* 🔐 Authentication Context */}
        <AuthProvider>
          <Loader />
          {children}</AuthProvider>
      </body>
    </html>
  );
}
