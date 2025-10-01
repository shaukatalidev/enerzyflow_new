"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../app/context/AuthContext';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const { user, isAuthenticated, logout, isLoading, profileLoaded } = useAuth();

  const getUserInitials = () => {
    const name = user?.profile?.name || user?.name;
    if (name) {
      return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    const name = user?.profile?.name || user?.name;
    if (name) {
      return name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getFullName = () => {
    return user?.profile?.name || user?.name || user?.email?.split('@')[0] || 'User';
  };

  const getCompanyLogo = () => {
    const logo = user?.company?.logo; 
    return logo;
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (pathname === '/') {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      router.push('/#about');
    }
  };

  const handlePartnersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (pathname === '/') {
      const partnersSection = document.getElementById('partners');
      if (partnersSection) {
        partnersSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      router.push('/#partners');
    }
  };

  const handleLogout = async () => {
    setShowProfileDropdown(false);
    await logout();
    router.push('/');
  };

  const handleDashboard = () => {
    setShowProfileDropdown(false);
    router.push('/dashboard');
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

          {/* Navigation Links */}
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

          {/* Profile Section or Sign In Button */}
          <div>
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <button className="p-2 rounded-full hover:bg-gray-100 relative">
                  <Bell className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                
                {/* Profile Section with greeting */}
                <div className="flex items-center space-x-3">
                  {/* Greeting text */}
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-900">Hi {getDisplayName()}!</p>
                    <p className="text-xs text-gray-500">Let's get your orders rolling</p>
                  </div>
                  
                  {/* Profile dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
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
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = parent.querySelector('.fallback-initials');
                                if (fallback) {
                                  (fallback as HTMLElement).style.display = 'flex';
                                }
                              }
                            }}
                          />
                        ) : null}
                        {/* Fallback initials */}
                        <span 
                          className={`fallback-initials text-white text-sm font-semibold ${
                            getCompanyLogo() ? 'hidden' : 'flex'
                          } items-center justify-center w-full h-full`}
                        >
                          {getUserInitials()}
                        </span>
                      </div>
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Profile Dropdown */}
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {getFullName()}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <p className="text-xs text-blue-600 capitalize">{user.role?.replace('_', ' ')}</p>
                          {user.company?.name && (
                            <p className="text-xs text-gray-400 mt-1">{user.company.name}</p>
                          )}
                        </div>
                        <div className="py-1">
                          <button
                            onClick={handleDashboard}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span>Dashboard</span>
                          </button>
                          <Link
                            href="/profile"
                            onClick={() => setShowProfileDropdown(false)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                          <hr className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
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
                <button className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                  Sign In
                </button>
              </Link>
            )}
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
  );
};

export default Header;
