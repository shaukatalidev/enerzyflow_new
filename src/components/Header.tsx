"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Bell, User, LogOut } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsAuthenticated(!!token);
  }, []);

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
  }

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

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
            <button suppressHydrationWarning
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
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <button className="p-2 rounded-full hover:bg-gray-100 relative">
                  <Bell className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                
                {/* Profile Section */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                  >
                    <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Hi Ankit!</p>
                      <p className="text-xs text-gray-500">3 new orders waiting for you</p>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">Ankit</p>
                        <p className="text-xs text-gray-500">ankit@example.com</p>
                      </div>
                      <button
                        onClick={handleDashboard}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-4xl text-sm font-medium hover:bg-blue-700 hover:cursor-pointer transition-colors">
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
