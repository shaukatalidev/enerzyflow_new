"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Bell, X, Menu } from "lucide-react";
import { useAuth } from "../app/context/AuthContext";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const getUserInitials = () => {
    const name = user?.profile?.name || user?.name;
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
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
          <Image
            src="/images/logo_bottles/logo.png"
            alt="EnerzyFlow"
            width={120}
            height={40}
          />
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
                     bg-black/60 backdrop-blur-md
                     border border-white/10
                     rounded-full px-6 py-3
                     shadow-[0_0_30px_rgba(0,240,255,0.12)]"
        >
          {/* ================= LOGO ================= */}
         {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
  <div  className="w-13 h-13 rounded-full 
               flex items-center justify-center
               overflow-hidden
               shadow-[0_0_15px_rgba(0,240,255,0.4)]">
    <Image
      src="/images/logo_bottles/logo.png"
      alt="EnerzyFlow Icon"
      width={48}
      height={48}
      className="object-contain"
      priority
    />
  </div>

  <span className="text-white font-bold text-xl">
    EnerzyFlow
  </span>
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
                <span
                  className="absolute -bottom-1 left-0 h-[1px] w-0 bg-cyan-400
                             transition-all duration-300
                             shadow-[0_0_10px_rgba(0,240,255,0.9)]
                             group-hover:w-full"
                />
              </Link>
            ))}
          </nav>

          {/* ================= RIGHT ================= */}
          <div className="hidden md:flex items-center gap-4">
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
                    className="h-10 w-10 rounded-full
                               bg-gradient-to-br from-cyan-500 to-blue-600
                               text-white font-semibold flex items-center justify-center
                               shadow-[0_0_15px_rgba(0,240,255,0.8)]"
                  >
                    {getUserInitials()}
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                      <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/10"
                      >
                        Dashboard
                      </button>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10"
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
                <button className="bg-cyan-500 text-black px-6 py-2 rounded-full
                                   font-medium hover:bg-cyan-400
                                   shadow-[0_0_25px_rgba(0,240,255,0.6)]">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* ================= MOBILE BUTTON ================= */}
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
                  className="text-gray-300 hover:text-cyan-400 transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 border-t border-white/10 pt-6">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-red-400 hover:bg-red-500/10 py-2 rounded"
                >
                  Sign Out
                </button>
              ) : (
                <Link href="/login">
                  <button className="w-full bg-cyan-500 text-black py-2 rounded-full shadow-[0_0_25px_rgba(0,240,255,0.6)]">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
