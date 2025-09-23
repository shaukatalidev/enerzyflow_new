// src/components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <Image
              src="/images/enerzyflow.png"
              alt="Flow Logo"
              width={140}
              height={40}
            />
          </div>
          <p className="mt-4 md:mt-0 text-gray-500 max-w-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt
          </p>
        </div>

        <div className="border-b border-gray-200 my-10"></div>

        {/* Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-8">
          {/* Product Links */}
          <div>
            <h3 className="font-bold text-gray-800">Product</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Case studies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Updates
                </Link>
              </li>
            </ul>
          </div>
          {/* Company Links */}
          <div>
            <h3 className="font-bold text-gray-800">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Culture
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          {/* Support Links */}
          <div>
            <h3 className="font-bold text-gray-800">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Getting started
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Help center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Server status
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Report a bug
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Chat support
                </Link>
              </li>
            </ul>
          </div>
          {/* Downloads Links */}
          <div>
            <h3 className="font-bold text-gray-800">Downloads</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  iOS
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Android
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Mac
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Windows
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-cyan-600">
                  Chrome
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscription Form */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-gray-800">
              Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-gray-600 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit aliquam
              mauris sed ma
            </p>
            <form className="mt-4 space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-cyan-500 text-white px-6 py-3 rounded-full hover:bg-cyan-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            Copyright © 2024 Enerzyflow | All Rights Reserved
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link href="#">
              <Image
                src="/images/brands/x_logo.png"
                alt="X"
                width={24}
                height={24}
                className="hover:opacity-75"
              />
            </Link>
            <Link href="https://www.facebook.com/share/19obQzdUev/">
              <Image
                src="/images/brands/f.png"
                alt="Facebook"
                width={24}
                height={24}
                className="hover:opacity-75"
              />
            </Link>
            <Link href="https://www.linkedin.com/company/106605789/admin/page-posts/published/">
              <Image
                src="/images/brands/linkedin.png"
                alt="LinkedIn"
                width={24}
                height={24}
                className="hover:opacity-75"
              />
            </Link>
            <Link href="#">
              <Image
                src="/images/brands/utube.png"
                alt="YouTube"
                width={24}
                height={24}
                className="hover:opacity-75"
              />
            </Link>
            <Link href="https://www.instagram.com/enerzyflow?igsh=MTRiZzkwMGs1dHNvNQ==">
              <Image
                src="/images/brands/insta.png"
                alt="Instagram"
                width={24}
                height={24}
                className="hover:opacity-75"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
