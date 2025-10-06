"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Bell, User, LogOut, X, Menu } from "lucide-react";
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
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const getUserInitials = () => {
    const name = user?.profile?.name || user?.name;
    if (name) {
      return name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    const name = user?.profile?.name || user?.name;
    if (name) {
      return name.split(" ")[0];
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const getFullName = () => {
    return (
      user?.profile?.name || user?.name || user?.email?.split("@")[0] || "User"
    );
  };

  const getCompanyLogo = () => {
    const logo = user?.company?.logo;
    return logo;
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (pathname === "/") {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      router.push("/#about");
    }
  };

  const handlePartnersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (pathname === "/") {
      const partnersSection = document.getElementById("partners");
      if (partnersSection) {
        partnersSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      router.push("/#partners");
    }
  };

  const handleLogout = async () => {
  setShowProfileDropdown(false);
  setIsMobileMenuOpen(false);
  await logout(); 
};


  const handleDashboard = () => {
    setShowProfileDropdown(false);
    setIsMobileMenuOpen(false);
    router.push("/dashboard");
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <header className="bg-white backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/images/enerzyflow.png"
                  alt="Flow Logo"
                  width={130}
                  height={130}
                />
              </Link>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/images/enerzyflow.png"
                  alt="Flow Logo"
                  width={130}
                  height={130}
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex md:space-x-8">
              <button
                onClick={handleAboutClick}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                About Us
              </button>
              <Link
                href="/solutions"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Solutions
              </Link>
              <button
                onClick={handlePartnersClick}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Partners
              </button>
              <Link
                href="/products"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/license"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Licenses
              </Link>
            </nav>

            {/* Desktop Profile Section or Sign In Button */}
            <div className="hidden md:block">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  {/* Notification Bell */}
                  <button className="p-2 rounded-full hover:bg-gray-100 relative cursor-pointer transition-colors">
                    <Bell className="h-6 w-6 text-gray-600" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {/* Profile Section with greeting */}
                  <div className="flex items-center space-x-3">
                    {/* Greeting text */}
                    <div className="hidden lg:block text-right">
                      <p className="text-sm font-medium text-gray-900">
                        Hi {getDisplayName()}!
                      </p>
                      <p className="text-xs text-gray-500">
                        Let&apos;s get your orders rolling
                      </p>
                    </div>

                    {/* Profile dropdown */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowProfileDropdown(!showProfileDropdown)
                        }
                        className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer"
                      >
                        {/* Profile Picture - Company Logo or Initials */}
                        <div className="h-10 w-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                          {getCompanyLogo() ? (
                            <Image
                              src={getCompanyLogo()!}
                              alt="Company Logo"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              unoptimized
                              onError={(e) => {
                                console.error("❌ Image load error");
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  const fallback =
                                    parent.querySelector(".fallback-initials");
                                  if (fallback) {
                                    (fallback as HTMLElement).style.display =
                                      "flex";
                                  }
                                }
                              }}
                            />
                          ) : null}
                          {/* Fallback initials */}
                          <span
                            className={`fallback-initials text-white text-sm font-semibold ${
                              getCompanyLogo() ? "hidden" : "flex"
                            } items-center justify-center w-full h-full`}
                          >
                            {getUserInitials()}
                          </span>
                        </div>
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Profile Dropdown */}
                      {showProfileDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900">
                              {getFullName()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                            <p className="text-xs text-blue-600 capitalize">
                              {user.role?.replace("_", " ")}
                            </p>
                            {user.company?.name && (
                              <p className="text-xs text-gray-400 mt-1">
                                {user.company.name}
                              </p>
                            )}
                          </div>
                          <div className="py-1">
                            <button
                              onClick={handleDashboard}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer transition-colors"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                />
                              </svg>
                              <span>Dashboard</span>
                            </button>

                            {/* Only show Profile link for non-printing users */}
                            {user.role !== "printing" && (
                              <Link
                                href="/profile"
                                onClick={() => setShowProfileDropdown(false)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer transition-colors"
                              >
                                <User className="h-4 w-4" />
                                <span>Profile</span>
                              </Link>
                            )}

                            <hr className="my-1" />
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <button className="bg-cyan-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-cyan-600 transition-colors cursor-pointer">
                    Sign In
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button and Profile */}
            <div className="md:hidden flex items-center space-x-3">
              {isAuthenticated && user && (
                <div className="h-8 w-8 rounded-full flex items-center justify-center shadow-md overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                  {getCompanyLogo() ? (
                    <Image
                      src={getCompanyLogo()!}
                      alt="Company Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-white text-xs font-semibold">
                      {getUserInitials()}
                    </span>
                  )}
                </div>
              )}

              {/* Hamburger / Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {showProfileDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowProfileDropdown(false)}
          />
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop - covers entire screen including header */}
          <div
            className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel - Full height from top */}
          <div className="fixed inset-0 z-[70] md:hidden bg-white overflow-y-auto">
            {/* Close button at top */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-4 py-6">
              {/* User Info Section (if authenticated) */}
              {isAuthenticated && user && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                      {getCompanyLogo() ? (
                        <Image
                          src={getCompanyLogo()!}
                          alt="Company Logo"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-white text-base font-semibold">
                          {getUserInitials()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {getFullName()}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.company?.name && (
                        <p className="text-xs text-gray-400">
                          {user.company.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mobile Profile Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={handleDashboard}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-3 transition-colors cursor-pointer"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                      <span>Dashboard</span>
                    </button>
                    <Link
                      href="/profile"
                      onClick={handleLinkClick}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-3 transition-colors cursor-pointer"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-3 transition-colors cursor-pointer">
                      <Bell className="h-5 w-5" />
                      <span>Notifications</span>
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        3
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1">
                <button
                  onClick={handleAboutClick}
                  className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                >
                  About Us
                </button>
                <Link
                  href="/solutions"
                  onClick={handleLinkClick}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Solutions
                </Link>
                <button
                  onClick={handlePartnersClick}
                  className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                >
                  Partners
                </button>
                <Link
                  href="/products"
                  onClick={handleLinkClick}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Products
                </Link>
                <Link
                  href="/license"
                  onClick={handleLinkClick}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Licenses
                </Link>
              </nav>

              {/* Sign In/Out Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                {isAuthenticated && user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-3 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link href="/login" onClick={handleLinkClick}>
                    <button className="w-full bg-cyan-500 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-cyan-600 transition-colors cursor-pointer">
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
