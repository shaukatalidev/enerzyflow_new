"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Bell, X, Menu, Home } from "lucide-react";
import { useAuth } from "../app/context/AuthContext";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, logout, isLoading } = useAuth();

  /* ================= CLOSE MOBILE ON ROUTE CHANGE ================= */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  /* ================= BODY SCROLL LOCK ================= */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  /* ================= USER INITIALS ================= */
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

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <header className="fixed top-4 w-full z-50 px-4">
        <div className="max-w-7xl mx-auto h-16 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-between px-6">
          <Image src="/images/logo_bottles/logo.png" alt="EnerzyFlow" width={120} height={40} />
          <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed top-4 w-full z-50 px-4">
        <div
          className="max-w-7xl mx-auto flex items-center justify-between
                     bg-black/60 backdrop-blur-md border border-white/10
                     rounded-full px-6 py-3
                     shadow-[0_0_30px_rgba(0,240,255,0.12)]"
        >
          {/* ================= LOGO ================= */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Image
                src="/images/logo_bottles/logo.png"
                alt="EnerzyFlow"
                width={48}
                height={48}
                priority
              />
            </div>
            <span className="text-white font-bold text-xl">EnerzyFlow</span>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            {[
              { label: "About Us", href: "/about" },
              { label: "Our Bottles", href: "/products" },
              { label: "Partner", href: "/partner" },
              { label: "Invest", href: "/invest" },
              { label: "Solution", href: "/solutions" },
              { label: "Licenses", href: "/licenses" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative group hover:text-white transition-colors"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* ================= RIGHT (DESKTOP) ================= */}
          {/* ================= RIGHT (DESKTOP) ================= */}
<div className="hidden md:flex items-center gap-4">
  {/* ✅ HOME ICON (ONLY WHEN NOT HOME PAGE) */}
  {pathname !== "/" && (
    <Link
      href="/"
      aria-label="Home"
      className="p-2 rounded-full hover:bg-white/10 flex items-center justify-center"
    >
      <Home className="h-6 w-6 text-cyan-400" />
    </Link>
  )}

            {isAuthenticated && user ? (
              <>
                <button className="relative p-2 rounded-full hover:bg-white/10">
                  <Bell className="h-5 w-5 text-gray-300" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown((v) => !v)}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold flex items-center justify-center"
                  >
                    {getUserInitials()}
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-black/80 backdrop-blur-md rounded-xl border border-white/10">
                      <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/10"
                      >
                        Dashboard
                      </button>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-white/10"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Profile
                      </Link>
                      <hr className="border-white/10" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login">
                <button className="bg-cyan-500 text-black px-6 py-2 rounded-full font-medium">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-white/10 text-white"
          >
            <Menu />
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-full bg-black z-50 p-6 text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X />
              </button>
            </div>

           {/* ✅ HOME (ONLY WHEN NOT HOME PAGE) */}
{pathname !== "/" && (
  <Link
    href="/"
    className="flex items-center gap-2 text-cyan-400 mb-4"
    onClick={() => setIsMobileMenuOpen(false)} // close menu
  >
    <Home size={18} /> Home
  </Link>
)}


            <nav className="flex flex-col gap-4">
              {[
                { label: "About Us", href: "/about" },
                { label: "Our Bottles", href: "/products" },
                { label: "Partner", href: "/partner" },
                { label: "Invest", href: "/invest" },
                { label: "Solution", href: "/solutions" },
                { label: "Licenses", href: "/licenses" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-cyan-400"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
