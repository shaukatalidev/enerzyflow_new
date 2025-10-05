import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EnerzyFlow - Bottles With a Voice",
  description:
    "See how brands are leaving their mark with EnerzyFlow beverage solutions",
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
