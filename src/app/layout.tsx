import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: {
    default: "EnerzyFlow – Bottles With a Voice",
    template: "%s | EnerzyFlow",
  },
  description:
    "EnerzyFlow creates smart, customizable bottles that communicate your brand’s message effectively.",

  openGraph: {
    title: "EnerzyFlow – Bottles With a Voice",
    description:
      "Smart bottles that communicate your brand’s message effectively.",
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
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "EnerzyFlow – Bottles With a Voice",
    description:
      "Smart bottles that communicate your brand’s message effectively.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster 
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
              maxWidth: '500px',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
                color: '#fff',
                maxWidth: '600px',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
              },
            },
            loading: {
              duration: Infinity,
              style: {
                background: '#3b82f6',
                color: '#fff',
              },
            },
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
