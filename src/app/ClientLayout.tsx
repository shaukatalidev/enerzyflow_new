"use client";

import { AuthProvider } from "./context/AuthContext";
import Loader from "@/components/Loader";
import { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showLoaderOnce = useRef(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Toaster position="top-center" />

      <AuthProvider>
        {mounted && showLoaderOnce.current && <Loader />}

        {mounted &&
          (() => {
            showLoaderOnce.current = false;
            return children;
          })()}
      </AuthProvider>
    </>
  );
}
