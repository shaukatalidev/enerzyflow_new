"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Bell, X, Menu, Home } from "lucide-react";
import { useAuth } from "../app/context/AuthContext";

const Header = () => {
  const pathname = usePathname();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, logout, isLoading } = useAuth();

  /* ================= EFFECTS ================= */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  /* ================= HELPERS ================= */
  const getUserInitials = () => {
    const name = user?.profile?.name || user?.name;
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : user?.email?.[0]?.toUpperCase() || "U";
  };

  const handleLogout = async () => {
    setShowProfileDropdown(false);
    setIsMobileMenuOpen(false);
    await logout();
  };

  if (isLoading) return null;

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed top-4 w-full z-50 px-4">
        <div className="relative max-w-7xl mx-auto flex items-center">
          {/* ================= MAIN HEADER BOX ================= */}
          <div
            className="flex w-full items-center justify-between
                       bg-black/60 backdrop-blur-md border border-white/10
                       rounded-full px-6 py-3
                       shadow-[0_0_30px_rgba(0,240,255,0.12)]"
          >
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo_bottles/logo.png"
                alt="EnerzyFlow"
                width={48}
                height={48}
                priority
              />
              <span className="text-white font-bold text-xl">EnerzyFlow</span>
            </Link>

            {/* NAV */}

            {/* NAV */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {[
                { label: "About Us", href: "/about" },
                { label: "Our Bottles", href: "/products" },
                { label: "Partner", href: "/partner" },
                { label: "Invest", href: "/invest" },
                { label: "Solution", href: "/solutions" },
                { label: "Licenses", href: "/licenses" },
              ].map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative transition-colors
          ${isActive ? "text-white" : "text-gray-400 hover:text-white"}
        `}
                  >
                    {item.label}

                    {/* UNDERLINE */}
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-cyan-400 transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT INSIDE HEADER */}
            <div className="hidden md:flex items-center gap-4">
              {pathname !== "/" && (
                <Link href="/" aria-label="Home">
                  <Home className="h-6 w-6 text-cyan-400" />
                </Link>
              )}

              {isAuthenticated && user ? (
                <>
                  <Bell className="h-5 w-5 text-gray-300" />
                  <button
                    onClick={() => setShowProfileDropdown((v) => !v)}
                    className="h-10 w-10 rounded-full bg-cyan-500 text-black font-semibold"
                  >
                    {getUserInitials()}
                  </button>
                </>
              ) : (
                // <Link href="/login">
                //   <button className="bg-cyan-500 text-black px-6 py-2 rounded-full font-medium">
                //     Sign In
                //   </button>
                // </Link>
                <Link
                  href="https://discover.enerzyflow.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-cyan-500 text-black px-6 py-2 rounded-full font-medium">
                    Sign In
                  </button>
                </Link>
              )}
            </div>

            {/* MOBILE MENU ICON */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-white"
            >
              <Menu />
            </button>
          </div>

          {/* ================= GET FRANCHISE (OUTSIDE HEADER) ================= */}
          <div className="hidden md:flex ml-3">
            <Link href="/franchise">
              <button
                className="
        h-14 px-6
        flex items-center justify-center
        whitespace-nowrap
        rounded-full
        bg-gradient-to-r from-cyan-400 to-blue-500
        text-black font-semibold
        shadow-[0_0_20px_rgba(0,240,255,0.45)]
        hover:scale-105 transition
      "
              >
                Get Franchise
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 p-6 text-white">
          <button onClick={() => setIsMobileMenuOpen(false)} className="mb-6">
            <X />
          </button>

          <Link
            href="/franchise"
            className="block mb-5 text-center px-5 py-3 rounded-full
                       bg-gradient-to-r from-cyan-400 to-blue-500
                       text-black font-semibold"
          >
            Get Franchise
          </Link>

          {[
            "about",
            "products",
            "partner",
            "invest",
            "solutions",
            "licenses",
          ].map((p) => (
            <Link key={p} href={`/${p}`} className="block py-2 text-gray-300">
              {p}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Header;
