'use client';

import { Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import Loader from "@/components/Loader";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showLoaderOnce = useRef(true);
  const [mounted, setMounted] = useState(false);

  // ✅ Wait until client hydration is done
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-dark text-white`}>
        <Toaster position="top-center" />

        <AuthProvider>
          {/* ✅ Render loader ONLY after mount */}
          {mounted && showLoaderOnce.current && <Loader />}

          {mounted &&
            (() => {
              showLoaderOnce.current = false;
              return children;
            })()}
        </AuthProvider>
      </body>
    </html>
  );
}
