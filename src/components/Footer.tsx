import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.elements.namedItem(
      "email"
    ) as HTMLInputElement;
    console.log("Subscribed:", email.value);
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Logo and Description */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-8">
          <div className="flex-shrink-0">
            <Image
              src="/images/enerzyflow.png"
              alt="Flow Logo"
              width={140}
              height={40}
            />
          </div>
          <p className="text-gray-600 text-sm md:text-base max-w-md">
            Transforming bottles into branding powerhouses. We help businesses
            elevate their brand through premium custom water bottles with
            innovative design and QR code integration.
          </p>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200 my-6 md:my-8"></div>

        {/* Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Case studies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Culture
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Getting started
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Help center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Server status
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Report a bug
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Chat support
                </Link>
              </li>
            </ul>
          </div>

          {/* Downloads Links */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              Downloads
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  iOS
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Android
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Mac
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Windows
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-cyan-600 text-sm"
                >
                  Chrome
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscription Form */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              Subscribe to our newsletter
            </h3>
            <p className="text-gray-600 text-xs mb-3 leading-relaxed">
              Stay updated with the latest trends in custom branding, exclusive
              offers, and innovative solutions for your business.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-400 text-gray-900"
              />
              <button
                type="submit"
                className="bg-cyan-500 text-white px-6 py-3 rounded-full hover:bg-cyan-600 cursor-pointer transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            Copyright © 2024 Enerzyflow | All Rights Reserved
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://www.facebook.com/share/19obQzdUev/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Image
                src="/images/brands/f.png"
                alt="Facebook"
                width={20}
                height={20}
                className="hover:opacity-75 transition-opacity"
              />
            </Link>
            <Link
              href="https://www.linkedin.com/company/106605789/admin/page-posts/published/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Image
                src="/images/brands/linkedin.png"
                alt="LinkedIn"
                width={20}
                height={20}
                className="hover:opacity-75 transition-opacity"
              />
            </Link>
            <Link
              href="https://www.instagram.com/enerzyflow?igsh=MTRiZzkwMGs1dHNvNQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Image
                src="/images/brands/insta.png"
                alt="Instagram"
                width={20}
                height={20}
                className="hover:opacity-75 transition-opacity"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
